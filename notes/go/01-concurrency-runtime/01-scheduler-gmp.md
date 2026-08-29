# ⚙️ Go Scheduler (GMP) — Interview Prep Notes

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b1a407e452d81178811cf20ed9317f2)

Notes from interview prep session, covering the GMP model down to goroutine/stack internals. Prepared for Senior Go Engineer interviews (fintech/payments angle).

> ✅ Reviewed and expanded. Accurate as of **Go 1.26** (released Feb 2026). Two corrections were made to the original notes: the **syscall P-handoff** is optimistic, not immediate (§3), and the **scavenger** is no longer sysmon's job (§4, §11).

## 1. The GMP Model

Go uses an M:N scheduler:

- **G** — goroutine
- **M** — OS thread (`machine`)
- **P** — logical processor (count = `GOMAXPROCS`), holds a local run queue

An M must **hold a P** to execute Go code. This is the key invariant: P is the permission token, M is the muscle, G is the work. Ps are the reason parallelism is bounded while goroutine count is not.

This decouples "how much parallelism" (number of Ps) from "how many concurrent tasks" (unbounded Gs) — goroutines start at 2KB vs. OS threads at 1–8MB, so spawning hundreds of thousands is cheap.

**Interview framing:** _"Walk me through `go func(){...}()` to it running on a core"_ → created G lands on `runnext` / local queue / global queue → an idle or stealing P picks it up → its M executes it.

## 2. Run Queue Anatomy (the detail most people miss)

There are **three** places a runnable G can live, checked in this priority order:

| Queue            | Capacity                       | Notes                                               |
| ---------------- | ------------------------------ | --------------------------------------------------- |
| `runnext`        | **1 slot**, per-P              | The most recently readied G. Jumps the whole queue. |
| Local run queue  | **256**, per-P, lock-free ring | Fast path. No global lock needed.                   |
| Global run queue | Unbounded, mutex-protected     | Overflow + spillover target.                        |

**`runnext` — the locality optimization.** When goroutine A unblocks goroutine B (e.g. a channel send that wakes a receiver), B goes into A's P's `runnext` slot, not the tail of the queue. Rationale: B is probably about to consume data A just produced, so it's cache-hot _right now_. It runs next, inheriting the remainder of the current time slice. Whatever was previously in `runnext` gets kicked to the regular local queue.

**Overflow behaviour.** If the local queue is full on a push, the P moves **half of its local queue (128 Gs) plus the new G** to the global queue in one batch. Batching avoids hammering the global lock.

**Global queue starvation guard.** A P that only ever drains its own local queue would starve the global queue forever. So every 61st scheduling tick, `schedule()` checks the global queue _first_:

```go
// runtime/proc.go, simplified
if pp.schedtick%61 == 0 && sched.runqsize > 0 {
    gp = globrunqget(pp, 1)
}
```

61 is prime, deliberately — a prime interval avoids resonating with any periodic pattern in the workload.

**Work stealing.** When a P finds nothing locally, it runs `findRunnable()`: check global queue → poll the netpoller → then attempt to steal from a **random** other P (randomized start order, 4 passes). A successful steal takes **half** the victim's queue. On the final pass it will also steal the victim's `runnext`, but only after a brief spin, giving the victim a chance to actually run it.

**Spinning Ms.** An M looking for work is marked _spinning_ (`sched.nmspinning`). The runtime maintains an invariant that if there is any runnable work and any idle P, at least one M is spinning — this is what prevents the classic "work was queued but everyone went to sleep" missed-wakeup bug. Spinning is capped (roughly at `GOMAXPROCS`) so idle machines don't burn CPU.

## 3. GOMAXPROCS

Defaults to the number of logical CPUs. Two important refinements:

- Before Go 1.25, this was the **host's** CPU count, which was wrong inside containers — a pod limited to 2 CPUs on a 64-core node would still get `GOMAXPROCS=64`, causing excessive context switching and, worse, **cgroup CPU throttling** (the kernel hard-pauses the process for the rest of the 100ms period). This was the reason `go.uber.org/automaxprocs` existed.
- **Go 1.25+ is container-aware**: on Linux the runtime reads the cgroup CPU bandwidth limit and defaults `GOMAXPROCS` to it (rounded **up** to the next whole CPU, never below 1), and **re-checks periodically** in case the orchestrator changes the limit at runtime. Opt out with `GODEBUG=containermaxprocs=0` / `updatemaxprocs=0`. Setting the env var or calling `runtime.GOMAXPROCS()` explicitly opts out of the automatic updates.

**Interview-ready nuance:** `GOMAXPROCS` is a **parallelism** limit (never more than N goroutines executing simultaneously); a cgroup CPU limit is a **throughput** limit (N CPU-seconds per 100ms period). They're not the same thing, which is why bursty apps can still get throttled even with a matched `GOMAXPROCS`. Good answer if asked "we set GOMAXPROCS correctly, why are we still throttling?"

## 4. Blocking Syscalls vs. Network I/O (netpoller)

These behave completely differently — a common trap question.

### Blocking syscall (file I/O, cgo)

⚠️ _Corrected from the original notes — the handoff is optimistic, not immediate._

On `entersyscall`, the runtime does **not** release the P. It marks it `_Psyscall` and the M keeps hold of it. Why: the overwhelming majority of syscalls return in microseconds, and a thread handoff costs far more than the syscall itself. If the syscall returns quickly, `exitsyscall` reacquires the same P on the fast path and nothing was lost.

The handoff only happens when the syscall turns out to be genuinely slow. **sysmon**'s `retake()` scans for Ps sitting in `_Psyscall` and calls `handoffp()` — waking or creating an M to take the P — if any of these hold:

- the P has queued work waiting (someone should be running it)
- there are no idle/spinning Ps left to absorb the load
- the syscall has been running for roughly **10ms+**

There is also `entersyscallblock`, used for syscalls the runtime _knows_ will block. That path releases the P immediately, skipping the optimistic phase.

**So the correct one-liner is:** "The P is retained optimistically and only handed off if the syscall proves slow or the system is under pressure — sysmon does the retaking."

### Network I/O (socket read/write)

fd is set non-blocking. If data isn't ready:

1. G is parked (`_Gwaiting`), and a pointer to it is stored **directly on the fd's `pollDesc` struct** (not in any run queue)
2. M is freed immediately — no blocking at all — and picks up the next runnable G
3. OS-level netpoller (epoll / kqueue / IOCP) watches the fd
4. When ready, `netpoll()` retrieves the G from the pollDesc, marks it runnable, pushes it to a run queue

**Who calls `netpoll()`?** A P calls it in `findRunnable()` when its own local queue is empty, right before it would otherwise go idle — cheap, since the P had nothing else to do anyway.

**Why does sysmon also need to check it?** If every P is saturated running CPU-bound work, none of them ever hit that idle checkpoint, so nobody calls `netpoll()`. Sysmon's periodic check is the backstop that guarantees ready network events still get noticed even when all Ps are busy.

This is the mechanism that lets Go handle huge numbers of concurrent connections on a small thread pool. Note the consequence: **file I/O does not use the netpoller** on Linux (regular files are always "ready" to epoll), which is why heavy disk I/O spawns real threads while heavy socket I/O doesn't.

## 5. sysmon

A special runtime loop running on its own dedicated M, **without ever acquiring a P** — deliberate, since its job is to watch for scenarios where every P is stuck. Runs with backoff (20µs up to approx. 10ms).

Each wake-up it checks:

- **Preemption:** any G running over 10ms on its M? → send `SIGURG` to force async preemption
- **Syscall retaking:** hand off Ps stuck in `_Psyscall` (see §4)
- **Netpoller backstop:** as above
- **Forced GC:** trigger one if it's been over 2 minutes since the last (`forcegcperiod`)

⚠️ **Correction:** the original notes listed _scavenging_ as a sysmon duty. That was true historically, but **since Go 1.16 the scavenger is its own background goroutine** (`bgscavenge`) with its own pacing controller, precisely so that returning memory to the OS doesn't get starved or delayed by sysmon's other work. See §11.

## 6. Preemption

**Pre-1.14 (cooperative only):** a G only yielded at safe points — function calls, channel ops, allocations. A tight loop with no function calls could run forever on its M, starving everything else on that P (including ready network I/O goroutines).

**1.14+ (async preemption):** sysmon detects a G running over 10ms and sends the OS thread a `SIGURG` signal. The signal handler rewrites the G's saved PC so that on return it enters `asyncPreempt`, which spills all registers, yields to the scheduler, and later restores them exactly.

⚠️ **Refinement of the original wording:** it is not _literally_ any instruction. The handler first calls `isAsyncSafePoint()`. Preemption is declined if the G is inside a `nosplit` function, mid-write-barrier, in an unmapped-stack state, or anywhere the GC could not accurately describe the register set. It retries on the next sysmon tick. "Async safe point" is the precise term worth using in an interview.

**Cooperative fallback still exists:** the runtime can poison a G's `stackguard0` with the `stackPreempt` sentinel to force the _next_ function prologue check to fail and trigger preemption via the older path. Both paths are used together — the GC in particular sets both and takes whichever lands first.

**Limits:** can't save you from goroutines stuck in a syscall that never returns, or from non-preemptible runtime-internal sections.

## 7. Goroutine States

Worth being able to name these; they show up constantly in `pprof` goroutine dumps.

| State         | Meaning                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `_Gidle`      | Just allocated, not initialized                                                                              |
| `_Grunnable`  | On a run queue, waiting for an M                                                                             |
| `_Grunning`   | Executing, owns an M and a P                                                                                 |
| `_Gsyscall`   | In a syscall, owns an M but not (logically) a P                                                              |
| `_Gwaiting`   | Blocked — channel, mutex, timer, netpoll. **Not** on any run queue; something must explicitly `goready()` it |
| `_Gdead`      | Finished or freshly freed; sits on a free list for reuse                                                     |
| `_Gcopystack` | Stack is being moved (grow/shrink), see §9                                                                   |

Note that `_Gdead` Gs are **pooled and reused** (`gfget`/`gfput`, per-P free lists), which is a large part of why goroutine creation is so cheap — it usually isn't an allocation at all.

## 8. Goroutine Internal Structure (runtime.g)

A goroutine's stack is **not** the OS thread's stack — it's a small (starting 2KB), heap-allocated, growable stack, unique per G.

Key fields on `runtime.g`:

- **stack** — hi/lo bounds of its own heap-allocated stack
- **stackguard0** — checked against SP on every function call; also poisoned to force cooperative preemption
- **sched (gobuf)** — saved register state when not running: `pc` (resume instruction), `sp`, `bp`, `ret`
- **m** — pointer to the M currently running it; nil when parked
- **atomicstatus** — `_Grunnable`, `_Grunning`, `_Gwaiting`, `_Gdead`, etc.
- **goid** — unique goroutine ID
- **waitreason** — why it's parked; this is the string you see in a goroutine dump ("chan receive", "select", "sync.Mutex.Lock")

**Context switch mechanics:** switching an M from G1 to G2 saves G1's PC/SP/BP into G1's `gobuf` and loads G2's saved state. It stays in user space—no kernel scheduler transition—but the actual latency depends heavily on hardware, cache state, and whether parking/wakeup is involved. Treat benchmark numbers as measurements, not runtime guarantees.

## 9. Stack Growth vs. Shrink

|              | Growth                       | Shrink                                 |
| ------------ | ---------------------------- | -------------------------------------- |
| Detected by  | The goroutine itself, inline | GC, during stack scan                  |
| Timing       | Any function call, anytime   | Only during a GC cycle                 |
| Target state | Actively running             | Paused/suspended first                 |
| Executed on  | g0 (via mcall from the G)    | Whatever G/worker is doing GC scanning |

**Growth:** compiler-inserted prologue check (SP vs `stackguard0`) fails → calls `runtime.morestack` → switches to g0 → `runtime.newstack` decides new size (2x, capped by `maxstacksize`, default **1GB on 64-bit / 250MB on 32-bit**) → `copystack` allocates, memmoves, and rewrites every pointer into the old stack range → resumes G on new stack.

Exceeding the cap gives `fatal error: stack overflow` — a fatal error, not a recoverable panic. This is what unbounded recursion produces.

**Shrink:** only triggered during GC's `scanstack()`. G must first be paused (via preemption machinery). If used stack is at most 1/4 of capacity, `shrinkstack()` runs the same copy-and-rewrite process downward, halving it.

**Why pointer rewriting is possible at all:** Go is precisely garbage collected, so the runtime has exact stack maps identifying every pointer-typed slot in every frame. A conservative-GC language could not safely move stacks. This is a good "why can Go do this and C++ can't" answer.

**Why not segmented stacks (linked chunks)?** Go tried this early on and hit the **hot split** problem — a function call right at a segment boundary inside a loop causes repeated grow/shrink thrashing on every iteration. Contiguous copying stacks avoid this; the occasional copy is amortized via geometric growth.

## 10. g0 — the Scheduler's Own Goroutine

Every M has exactly one **g0** — not a user goroutine, never runs application code. Its job: execute the scheduler itself (`schedule()`, `goexit()`), run `morestack`/`newstack`/`copystack`, and handle syscall entry/exit.

**Critical distinction:** g0 uses the OS thread's actual fixed stack, not a growable heap-allocated one.

**Why not a growable stack for g0 too?**

- **Circularity:** the code that grows/copies stacks (`morestack` → `newstack` → `copystack`) runs on g0. If g0's own stack could overflow mid-copy, you'd need to invoke the same machinery recursively while it's in a half-updated state.
- **Solved via `nosplit`:** the compiler statically proves these functions' stack usage is bounded (there's a fixed `nosplit` budget, and the linker errors at build time if the chain exceeds it) — not a size guess, a compile-time guarantee.
- **Safety at fragile moments:** g0 runs during signal handling, syscall entry/exit (before a P may even be reattached), and GC stack-scanning itself — moments when the normal growth machinery (allocator, scheduler) may not be safely available.

**Related fields on M:**

- **g0** — scheduler stack, described above
- **curg** — pointer to the user G currently executing (on its own growable heap stack)
- **gsignal** — separate dedicated `g` with its own stack just for handling OS signals like the preemption `SIGURG`, so a signal doesn't corrupt whatever g0/curg was mid-doing
- **p** — pointer to the P this M currently holds (nil if none)
- **lockedg** — set by `runtime.LockOSThread`, see §12

**m0/g0 special case:** the first M and its g0 are statically allocated at startup. Subsequent Ms receive runtime-managed system stacks when created via `newm`; their exact size and allocation strategy are implementation details and should not be treated as a portable constant.

**Full trace to rehearse:** _G blocks on a channel send_ → calls `gopark` → switches to g0 via `mcall` → g0 marks G `_Gwaiting`, detaches it from the M, calls `schedule()` → schedule finds next runnable G (runnext → local queue → global → netpoll → steal) → switches back via `gogo`, `curg` updates to the new G.

## 11. Idle Memory / Scavenging

Go's heap is organized in 64MB arenas. When the heap shrinks, the _virtual_ address space stays reserved, but the runtime tells the OS to reclaim the _physical_ pages via `madvise`.

**Who does it (corrected):** since Go 1.16 this is a dedicated background goroutine, `bgscavenge`, running a pacing controller that targets roughly 1% of total CPU. There is also _eager_ scavenging when an allocation would push the heap past `GOMEMLIMIT`.

**`MADV_DONTNEED` vs `MADV_FREE`:** Go 1.12 switched to `MADV_FREE` (lazier, cheaper — the kernel only reclaims under pressure) and then **reverted to `MADV_DONTNEED` in Go 1.16**, because `MADV_FREE` left RSS looking high in `top`/Kubernetes and made memory-limit tuning and OOM debugging miserable. Correctness of the metric beat raw speed. (`GODEBUG=madvdontneed=0` still exists.)

**Example:** a nightly batch/reconciliation job spikes heap to 2GB, then drops to approx. 100MB of live objects once GC runs. Without scavenging, RSS (what Kubernetes / `top` sees) stays near 2GB indefinitely, risking over-provisioned memory limits or OOM-kills elsewhere. The scavenger walks free spans and madvises pages back — this is what produces a "sawtooth" memory graph in Grafana rather than a permanently pinned plateau.

## 12. LockOSThread

`runtime.LockOSThread()` pins the calling G to its current M for the rest of that G's life (or until `UnlockOSThread`). The M will run no other goroutine.

**When it's actually needed:** OS thread-local state — cgo libraries with thread affinity (OpenGL contexts, some GUI toolkits), Linux namespaces (`setns`), `seccomp`, and per-thread credentials.

**Scheduler cost:** that M is removed from the general pool. If a locked G blocks, the runtime must hand the P to a _different_ M (`stoplockedm`/`startlockedm`), so it's strictly more expensive than normal scheduling. The runtime uses the startup thread during initialization, but ordinary `main.main` is **not** guaranteed to remain locked to it. If a GUI or C library requires startup-thread affinity, call `runtime.LockOSThread` from an `init` function before that thread can be released.

## 13. Observability Added in Go 1.26

Go 1.26 added scheduler metrics that are easier to reason about than deriving everything from goroutine dumps: `/sched/goroutines/runnable:goroutines`, `/sched/goroutines/waiting:goroutines`, `/sched/goroutines-created:goroutines`, and `/sched/threads:threads`. Read them through `runtime/metrics`; combine them with execution traces and goroutine profiles when diagnosing queueing or thread growth.

## 14. Interview Drills

- _"go func() to running on a core"_ → §1 + §2 (mention `runnext`; it signals depth)
- _"What happens when a goroutine does a blocking read?"_ → distinguish file vs socket; get the optimistic P retention right (§4)
- _"Why doesn't a tight `for {}` loop hang the program in modern Go?"_ → §6, sysmon + SIGURG + async safe points
- _"Our pod is CPU-throttled despite low average CPU"_ → §3, parallelism vs throughput limits
- _"Why are goroutines cheap?"_ → 2KB stacks, `_Gdead` reuse, userspace context switch (§8), no kernel involvement

## Official Sources

- [Go 1.26 release notes](https://go.dev/doc/go1.26)
- [Container-aware `GOMAXPROCS`](https://go.dev/blog/container-aware-gomaxprocs)
- [`runtime/proc.go`](https://go.dev/src/runtime/proc.go)
