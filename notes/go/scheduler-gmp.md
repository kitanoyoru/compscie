---
date: 2026-08-23
---

# Go Scheduler (GMP)

> Go uses an M:N scheduler. Goroutines (G) are multiplexed onto OS threads (M), and an M must hold a logical processor (P) to run Go code. Ps bound parallelism while the goroutine count is unbounded. This note covers the GMP model down to goroutine and stack internals. Checked against Go 1.26 (released Feb 2026).

## Questions this answers

- How does `go func(){...}()` end up running on a core?
- Where can a runnable goroutine live, and how does work stealing work?
- Why is a pod CPU-throttled despite a correct `GOMAXPROCS`?
- What really happens on a blocking syscall versus a socket read?
- Why doesn't a tight `for {}` loop hang the program?
- Why are goroutines cheap, and how do their stacks grow and shrink?
- Why does RSS stay high after a memory spike?

## Notes

### The GMP model

- **G**: goroutine.
- **M**: OS thread (`machine`).
- **P**: logical processor (count = `GOMAXPROCS`); holds a local run queue.

An M must **hold a P** to execute Go code. This is the key invariant: P is the permission token, M is the muscle, G is the work. Ps are the reason parallelism is bounded while goroutine count is not.

This decouples "how much parallelism" (number of Ps) from "how many concurrent tasks" (unbounded Gs). Goroutines start at 2KB versus 1-8MB for OS threads, so spawning hundreds of thousands is cheap.

**Interview framing:** _"Walk me through `go func(){...}()` to it running on a core."_ → The created G lands on `runnext`, the local queue, or the global queue. An idle or stealing P picks it up, and its M executes it.

### Run queue anatomy

There are **three** places a runnable G can live, checked in this priority order:

| Queue            | Capacity                       | Notes                                               |
| ---------------- | ------------------------------ | --------------------------------------------------- |
| `runnext`        | **1 slot**, per-P              | The most recently readied G. Jumps the whole queue. |
| Local run queue  | **256**, per-P, lock-free ring | Fast path. No global lock needed.                   |
| Global run queue | Unbounded, mutex-protected     | Overflow + spillover target.                        |

**`runnext`, the locality optimization.** When goroutine A unblocks goroutine B (for example a channel send that wakes a receiver), B goes into A's P's `runnext` slot, not the tail of the queue. Rationale: B is probably about to consume data A just produced, so it is cache-hot _right now_. It runs next, inheriting the remainder of the current time slice. Whatever was previously in `runnext` gets kicked to the regular local queue.

**Overflow behaviour.** If the local queue is full on a push, the P moves **half of its local queue (128 Gs) plus the new G** to the global queue in one batch. Batching avoids hammering the global lock.

**Global queue starvation guard.** A P that only ever drains its own local queue would starve the global queue forever. So every 61st scheduling tick, `schedule()` checks the global queue _first_:

```go
// runtime/proc.go, simplified
if pp.schedtick%61 == 0 && sched.runqsize > 0 {
    gp = globrunqget(pp, 1)
}
```

61 is prime, deliberately. A prime interval avoids resonating with any periodic pattern in the workload.

**Work stealing.** When a P finds nothing locally, it runs `findRunnable()`: check the global queue, poll the netpoller, then attempt to steal from a **random** other P (randomized start order, 4 passes). A successful steal takes **half** the victim's queue. On the final pass it will also steal the victim's `runnext`, but only after a brief spin, giving the victim a chance to actually run it.

**Spinning Ms.** An M looking for work is marked _spinning_ (`sched.nmspinning`). The runtime maintains an invariant that if there is any runnable work and any idle P, at least one M is spinning. This prevents the classic "work was queued but everyone went to sleep" missed-wakeup bug. Spinning is capped (at most half the number of busy Ps) so idle machines do not burn CPU.

### GOMAXPROCS

`GOMAXPROCS` defaults to the number of logical CPUs. Two important refinements:

- Before Go 1.25, this was the **host's** CPU count, which was wrong inside containers. A pod limited to 2 CPUs on a 64-core node would still get `GOMAXPROCS=64`. That caused excessive context switching and, worse, **cgroup CPU throttling** (the kernel hard-pauses the process for the rest of the 100ms period). This is why `go.uber.org/automaxprocs` existed.
- **Go 1.25+ is container-aware.** On Linux the runtime reads the cgroup CPU bandwidth limit and defaults `GOMAXPROCS` to it (rounded **up** to the next whole CPU, and never below 2 unless the machine or the CPU affinity mask has fewer than 2 CPUs). It **re-checks periodically** in case the orchestrator changes the limit at runtime. Opt out with `GODEBUG=containermaxprocs=0` / `updatemaxprocs=0`. Setting the env var or calling `runtime.GOMAXPROCS()` explicitly opts out of the automatic updates; `runtime.SetDefaultGOMAXPROCS()` restores them.

**Interview-ready nuance:** `GOMAXPROCS` is a **parallelism** limit (never more than N goroutines executing simultaneously). A cgroup CPU limit is a **throughput** limit (N CPU-seconds per 100ms period). They are not the same thing, which is why bursty apps can still get throttled even with a matched `GOMAXPROCS`. This is a good answer to "we set GOMAXPROCS correctly, why are we still throttling?"

### Blocking syscalls vs network I/O

These behave completely differently, which makes them a common trap question.

#### Blocking syscall (file I/O, cgo)

The handoff is optimistic, not immediate. On `entersyscall`, the runtime does **not** release the P. It marks it `_Psyscall` and the M keeps hold of it. The reason: the overwhelming majority of syscalls return in microseconds, and a thread handoff costs far more than the syscall itself. If the syscall returns quickly, `exitsyscall` reacquires the same P on the fast path and nothing was lost.

The handoff only happens when the syscall turns out to be genuinely slow. **sysmon**'s `retake()` scans for Ps sitting in `_Psyscall` and calls `handoffp()`, which wakes or creates an M to take the P, if any of these hold:

- the P has queued work waiting (someone should be running it);
- there are no idle or spinning Ps left to absorb the load;
- the syscall has been running for roughly **10ms or more**.

There is also `entersyscallblock`, used for syscalls the runtime _knows_ will block. That path releases the P immediately, skipping the optimistic phase.

**One-liner:** "The P is retained optimistically and only handed off if the syscall proves slow or the system is under pressure. sysmon does the retaking."

#### Network I/O (socket read/write)

The fd is set non-blocking. If data is not ready:

1. The G is parked (`_Gwaiting`), and a pointer to it is stored **directly on the fd's `pollDesc` struct** (not in any run queue).
2. The M is freed immediately, with no blocking at all, and picks up the next runnable G.
3. The OS-level netpoller (epoll / kqueue / IOCP) watches the fd.
4. When the fd is ready, `netpoll()` retrieves the G from the pollDesc, marks it runnable, and pushes it to a run queue.

**Who calls `netpoll()`?** A P calls it in `findRunnable()` when its own local queue is empty, right before it would otherwise go idle. This is cheap, since the P had nothing else to do anyway.

**Why does sysmon also need to check it?** If every P is saturated running CPU-bound work, none of them ever hit that idle checkpoint, so nobody calls `netpoll()`. Sysmon's periodic check is the backstop that guarantees ready network events still get noticed even when all Ps are busy.

This mechanism lets Go handle huge numbers of concurrent connections on a small thread pool. Note the consequence: **file I/O does not use the netpoller** on Linux (regular files are always "ready" to epoll), which is why heavy disk I/O spawns real threads while heavy socket I/O does not.

### sysmon

sysmon is a special runtime loop running on its own dedicated M, **without ever acquiring a P**. This is deliberate, since its job is to watch for scenarios where every P is stuck. It runs with backoff (20µs up to approximately 10ms).

Each wake-up it checks:

- **Preemption:** any G running over 10ms on its M? If so, send `SIGURG` to force async preemption.
- **Syscall retaking:** hand off Ps stuck in `_Psyscall` (see [blocking syscalls](#blocking-syscalls-vs-network-io)).
- **Netpoller backstop:** as above.
- **Forced GC:** trigger one if it has been over 2 minutes since the last (`forcegcperiod`).

**Scavenging is not a sysmon duty.** It was historically, but since Go 1.16 the scavenger is its own background goroutine (`bgscavenge`) with its own pacing controller, precisely so that returning memory to the OS is not starved or delayed by sysmon's other work. See [idle memory and scavenging](#idle-memory-and-scavenging).

### Preemption

**Before Go 1.14 (cooperative only):** a G yielded only at safe points: function calls, channel ops, allocations. A tight loop with no function calls could run forever on its M, starving everything else on that P (including ready network I/O goroutines).

**Go 1.14+ (async preemption):** sysmon detects a G running over 10ms and sends the OS thread a `SIGURG` signal. The signal handler rewrites the G's saved PC so that on return it enters `asyncPreempt`, which spills all registers, yields to the scheduler, and later restores them exactly.

**Preemption is not literally at any instruction.** The handler first calls `isAsyncSafePoint()`. Preemption is declined if the G is inside a `nosplit` function, mid-write-barrier, in an unmapped-stack state, or anywhere the GC could not accurately describe the register set. It retries on the next sysmon tick. "Async safe point" is the precise term worth using in an interview.

**Cooperative fallback still exists.** The runtime can poison a G's `stackguard0` with the `stackPreempt` sentinel to force the _next_ function prologue check to fail and trigger preemption via the older path. Both paths are used together. The GC in particular sets both and takes whichever lands first.

**Limits:** preemption cannot save you from goroutines stuck in a syscall that never returns, or from non-preemptible runtime-internal sections.

### Goroutine states

Worth being able to name these; they show up constantly in `pprof` goroutine dumps.

| State         | Meaning                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `_Gidle`      | Just allocated, not initialized                                                                             |
| `_Grunnable`  | On a run queue, waiting for an M                                                                            |
| `_Grunning`   | Executing, owns an M and a P                                                                                |
| `_Gsyscall`   | In a syscall, owns an M but not (logically) a P                                                             |
| `_Gwaiting`   | Blocked: channel, mutex, timer, netpoll. **Not** on any run queue; something must explicitly `goready()` it |
| `_Gdead`      | Finished or freshly freed; sits on a free list for reuse                                                    |
| `_Gcopystack` | Stack is being moved (grow/shrink), see [stack growth vs shrink](#stack-growth-vs-shrink)                   |

`_Gdead` Gs are **pooled and reused** (`gfget`/`gfput`, per-P free lists). This is a large part of why goroutine creation is so cheap: it usually is not an allocation at all.

### Goroutine internal structure

A goroutine's stack is **not** the OS thread's stack. It is a small (starting at 2KB), heap-allocated, growable stack, unique per G.

Key fields on `runtime.g`:

- **stack**: hi/lo bounds of its own heap-allocated stack.
- **stackguard0**: checked against SP on every function call; also poisoned to force cooperative preemption.
- **sched (gobuf)**: saved register state when not running: `pc` (resume instruction), `sp`, `bp`, `ret`.
- **m**: pointer to the M currently running it; nil when parked.
- **atomicstatus**: `_Grunnable`, `_Grunning`, `_Gwaiting`, `_Gdead`, etc.
- **goid**: unique goroutine ID.
- **waitreason**: why it is parked. This is the string you see in a goroutine dump ("chan receive", "select", "sync.Mutex.Lock").

**Context switch mechanics.** Switching an M from G1 to G2 saves G1's PC/SP/BP into G1's `gobuf` and loads G2's saved state. It stays in user space, with no kernel scheduler transition. The actual latency depends heavily on hardware, cache state, and whether parking or wakeup is involved. Treat benchmark numbers as measurements, not runtime guarantees.

### Stack growth vs shrink

|              | Growth                       | Shrink                                 |
| ------------ | ---------------------------- | -------------------------------------- |
| Detected by  | The goroutine itself, inline | GC, during stack scan                  |
| Timing       | Any function call, anytime   | Only during a GC cycle                 |
| Target state | Actively running             | Paused/suspended first                 |
| Executed on  | g0 (via mcall from the G)    | Whatever G/worker is doing GC scanning |

**Growth.** The compiler-inserted prologue check (SP vs `stackguard0`) fails and calls `runtime.morestack`. That switches to g0, where `runtime.newstack` decides the new size (2x, capped by `maxstacksize`, default **1GB on 64-bit / 250MB on 32-bit**). `copystack` then allocates, memmoves, and rewrites every pointer into the old stack range, and the G resumes on the new stack.

Exceeding the cap gives `fatal error: stack overflow`, a fatal error and not a recoverable panic. This is what unbounded recursion produces.

**Shrink.** Shrinking is triggered only during GC's `scanstack()`. The G must first be paused (via the preemption machinery). If the used stack is less than 1/4 of capacity, `shrinkstack()` runs the same copy-and-rewrite process downward, halving it.

**Why pointer rewriting is possible at all.** Go is precisely garbage collected, so the runtime has exact stack maps identifying every pointer-typed slot in every frame. A conservative-GC language could not safely move stacks. This is a good "why can Go do this and C++ can't" answer.

**Why not segmented stacks (linked chunks)?** Go tried this early on and hit the **hot split** problem: a function call right at a segment boundary inside a loop causes repeated grow/shrink thrashing on every iteration. Contiguous copying stacks avoid this, and the occasional copy is amortized via geometric growth.

### The g0 goroutine

Every M has exactly one **g0**. It is not a user goroutine and never runs application code. Its job is to execute the scheduler itself (`schedule()`, `goexit()`), run `morestack`/`newstack`/`copystack`, and handle syscall entry and exit.

**Critical distinction:** g0 uses the OS thread's actual fixed stack, not a growable heap-allocated one.

**Why not a growable stack for g0 too?**

- **Circularity.** The code that grows and copies stacks (`morestack` → `newstack` → `copystack`) runs on g0. If g0's own stack could overflow mid-copy, you would need to invoke the same machinery recursively while it is in a half-updated state.
- **Solved via `nosplit`.** The compiler statically proves these functions' stack usage is bounded (there is a fixed `nosplit` budget, and the linker errors at build time if the chain exceeds it). It is not a size guess but a compile-time guarantee.
- **Safety at fragile moments.** g0 runs during signal handling, syscall entry and exit (before a P may even be reattached), and GC stack scanning itself. These are moments when the normal growth machinery (allocator, scheduler) may not be safely available.

**Related fields on M:**

- **g0**: the scheduler stack, described above.
- **curg**: pointer to the user G currently executing (on its own growable heap stack).
- **gsignal**: a separate dedicated `g` with its own stack just for handling OS signals like the preemption `SIGURG`, so a signal does not corrupt whatever g0/curg was mid-doing.
- **p**: pointer to the P this M currently holds (nil if none).
- **lockedg**: set by `runtime.LockOSThread`, see [LockOSThread](#lockosthread).

**m0/g0 special case.** The first M and its g0 are statically allocated at startup. Subsequent Ms receive runtime-managed system stacks when created via `newm`. Their exact size and allocation strategy are implementation details and should not be treated as a portable constant.

**Full trace to rehearse:** a G blocks on a channel send → calls `gopark` → switches to g0 via `mcall` → g0 marks the G `_Gwaiting`, detaches it from the M, and calls `schedule()` → `schedule` finds the next runnable G (runnext → local queue → global → netpoll → steal) → switches back via `gogo`, and `curg` updates to the new G.

### Idle memory and scavenging

Go's heap is organized in 64MB arenas. When the heap shrinks, the _virtual_ address space stays reserved, but the runtime tells the OS to reclaim the _physical_ pages via `madvise`. For the collector side see [Go Garbage Collector](garbage-collector.md).

**Who does it:** since Go 1.16 this is a dedicated background goroutine, `bgscavenge`, running a pacing controller that targets roughly 1% of total CPU. There is also _eager_ scavenging when an allocation would push the heap past `GOMEMLIMIT`.

**`MADV_DONTNEED` vs `MADV_FREE`:** Go 1.12 switched to `MADV_FREE` (lazier and cheaper, since the kernel only reclaims under pressure). Go **reverted to `MADV_DONTNEED` in Go 1.16**, because `MADV_FREE` left RSS looking high in `top` and Kubernetes and made memory-limit tuning and OOM debugging miserable. Correctness of the metric beat raw speed. (`GODEBUG=madvdontneed=0` still exists.)

**Example:** a nightly batch or reconciliation job spikes the heap to 2GB, then drops to approximately 100MB of live objects once GC runs. Without scavenging, RSS (what Kubernetes and `top` see) would stay near 2GB indefinitely, risking over-provisioned memory limits or OOM-kills elsewhere. The scavenger walks free spans and madvises pages back. This is what produces a "sawtooth" memory graph in Grafana rather than a permanently pinned plateau.

### LockOSThread

`runtime.LockOSThread()` pins the calling G to its current M for the rest of that G's life (or until `UnlockOSThread`). The M will run no other goroutine.

**When it is actually needed:** OS thread-local state, such as cgo libraries with thread affinity (OpenGL contexts, some GUI toolkits), Linux namespaces (`setns`), `seccomp`, and per-thread credentials.

**Scheduler cost:** that M is removed from the general pool. If a locked G blocks, the runtime must hand the P to a _different_ M (`stoplockedm`/`startlockedm`), so it is strictly more expensive than normal scheduling.

The runtime uses the startup thread during initialization, but ordinary `main.main` is **not** guaranteed to remain locked to it. If a GUI or C library requires startup-thread affinity, call `runtime.LockOSThread` from an `init` function before that thread can be released.

### Scheduler metrics in Go 1.26

Go 1.26 added scheduler metrics that are easier to reason about than deriving everything from goroutine dumps: `/sched/goroutines/runnable:goroutines`, `/sched/goroutines/waiting:goroutines`, `/sched/goroutines-created:goroutines`, and `/sched/threads:threads`. Read them through `runtime/metrics`. Combine them with execution traces and goroutine profiles when diagnosing queueing or thread growth.

## Interview drills

- _"`go func()` to running on a core"_ → See [the GMP model](#the-gmp-model) and [run queue anatomy](#run-queue-anatomy). Mention `runnext`; it signals depth.
- _"What happens when a goroutine does a blocking read?"_ → Distinguish file from socket, and get the optimistic P retention right. See [blocking syscalls vs network I/O](#blocking-syscalls-vs-network-io).
- _"Why doesn't a tight `for {}` loop hang the program in modern Go?"_ → sysmon + `SIGURG` + async safe points. See [preemption](#preemption).
- _"Our pod is CPU-throttled despite low average CPU."_ → Parallelism versus throughput limits. See [GOMAXPROCS](#gomaxprocs).
- _"RSS stays high after a spike."_ → The scavenger returns pages to the OS over time. See [idle memory and scavenging](#idle-memory-and-scavenging).
- _"Why are goroutines cheap?"_ → 2KB stacks, `_Gdead` reuse, and a userspace context switch with no kernel involvement. See [goroutine internal structure](#goroutine-internal-structure).

## Sources

- [Go 1.26 release notes](https://go.dev/doc/go1.26)
- [Container-aware `GOMAXPROCS`](https://go.dev/blog/container-aware-gomaxprocs)
- [`runtime/proc.go`](https://go.dev/src/runtime/proc.go)
