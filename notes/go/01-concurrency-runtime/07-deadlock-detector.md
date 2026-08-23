# Go Deadlock Detector — checkdead()

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b1a407e452d81708f43e791a0fabd7a)

Notes from interview prep session. Companion to **Go Channels — Internals, sudog, and Select**.

> ✅ Reviewed for **Go 1.26**. The key distinction is global deadlock detection versus local deadlocks and goroutine leaks.

## 1. When checkdead() Runs

Not a graph-based cycle analyzer — a blunt global check called **`checkdead()`**, invoked from the scheduling path (`schedule()`/`stopm`) at the moment **every P has run dry and no M can find any runnable goroutine anywhere** (not in any local run queue, not the global queue, nothing stealable from any P).

At that point, before quietly parking the last M, the runtime asks: **"could anything possibly wake up in the future?"**

## 2. Decision Flow

Checks, in order, whether any of these could still produce future work:

- **Any M in a blocking syscall?** — it could return and hand back a runnable G
- **Any pending timers** (`time.Sleep`, `time.After`)? — one will eventually fire and wake a G
- **Any cgo call in flight, or GC in progress?** — also potential sources of future work

If **all** of these are "no" → the runtime concludes nothing in the program can ever progress again and crashes with:

```text
fatal error: all goroutines are asleep - deadlock!
```

**Important:** this is a **fatal error**, not a regular `panic` — cannot be caught with `recover()`. The runtime treats it as an unrecoverable program state.

## 3. The Crucial Nuance: Global, Not Pairwise

`checkdead()` only fires when the **entire** program has nothing left to do. It has no concept of "goroutine A and B are deadlocked with each other." If even one other goroutine anywhere is still doing legitimate work (e.g. an HTTP server serving other requests), two goroutines stuck forever waiting on each other via a channel will **never** trigger this detector — they just leak silently, forever, invisible to the runtime.

```go
// NOT detected — server keeps other goroutines busy
func main() {
    ch := make(chan int)
    go func() {
        <-ch // never receives, nobody ever sends — leaked forever
    }()
    http.ListenAndServe(":8080", nil) // keeps program "alive", masks the leak
}

// DETECTED — nothing else running anywhere
func main() {
    ch := make(chan int)
    <-ch // main itself blocks, nothing else running
    // instantly: fatal error: all goroutines are asleep - deadlock!
}
```

**Interview framing:** the deadlock detector is a last-resort safety net for a *fully-stuck* program, not a debugging tool for partial deadlocks. In production, a stuck pair of goroutines inside an otherwise-busy service silently leaks — you'd only catch it via goroutine-count metrics or a pprof goroutine profile showing an ever-growing count.

**Production monitoring tie-in:** exporting `runtime.NumGoroutine()` as a Prometheus gauge metric is a standard way to catch exactly this class of leak, since the runtime itself won't surface it.

## 4. What It Covers vs. Doesn't

**Covers:** channel send/receive blocking, `sync.WaitGroup.Wait()`, `sync.Mutex`/`RWMutex` blocking, `select` with no ready case and no default — anything routed through `gopark` counts toward "is this G ever coming back."

**Doesn't cover:**

- A single blocked goroutine sitting alongside other active work (the common real-world case)
- Logical deadlocks across separate processes or distributed locks (e.g. two services waiting on each other via gRPC) — entirely outside the Go runtime's visibility

## 5. Follow-ups to Have Ready

- *"If this only catches global deadlocks, how would you detect a leaked/stuck goroutine in a live payment service?"* →
	- `runtime.NumGoroutine()` as a monitored/alerted metric for unbounded growth
	- Periodic `pprof` goroutine profile snapshots (`/debug/pprof/goroutine?debug=2`) — shows full stack traces of every goroutine, pinpointing exactly where they're stuck
	- In code review: be suspicious of any channel operation without a corresponding `context.Context` cancellation path or timeout

## 6. Precision Notes

> ✅ Reviewed against the Go 1.26.5 runtime. Corrected the cgo/build-mode rule and documented the exact opt-in and limits of the Go 1.26 goroutine-leak profile.

A few refinements worth being precise about if pushed:

- **It counts Ms, not Ps.** `checkdead()` runs under `sched.lock` at the moment the **last M is about to park**, and its actual test is over thread counts: if there are no Ms running, none in syscalls, and no work that could produce a runnable G, the program is dead. The "every P has run dry" framing is the right intuition but the implementation is thread-oriented.
- **Locked threads are handled specially.** Goroutines pinned via `runtime.LockOSThread` are checked separately — a runnable G locked to a parked M means the runtime starts that M rather than declaring deadlock.
- **cgo does not suppress it merely because the binary uses cgo.** The explicit broad exemption is for `-buildmode=c-shared` and `-buildmode=c-archive` (except wasm), because the calling non-Go program may later enter Go again. Active syscalls/cgo callbacks also affect whether the runtime can conclude that no future work exists, but an ordinary cgo-enabled executable does not automatically lose deadlock detection.
- **The netpoller counts as potential work.** A goroutine blocked on a socket read is waiting on the netpoller, so the runtime knows an event could still arrive. This is *not* a deadlock even if nothing will ever actually be sent — which is why an idle server never trips the detector.

## 7. Detecting Leaks the Runtime Won't Report

This is the real follow-up (§5), and there's now a first-party answer.

### `goroutineleak` profile (Go 1.26, experimental)

Build with `GOEXPERIMENT=goroutineleakprofile`, then inspect `/debug/pprof/goroutineleak`. The implementation is intended to be production-ready, while the API/profile format remains experimental.

It uses reachability to report a useful subset of permanently blocked goroutines, such as goroutines waiting on channels or synchronization objects that no runnable goroutine can still reach. It is intentionally conservative: synchronization objects reachable from globals or from runnable goroutine locals can hide a leak, and other classes of stuck work may not be reported. It adds no extra runtime overhead unless the profile is actively requested.

### Established techniques (still the working answer today)

| Technique | What it catches |
| --- | --- |
| `runtime.NumGoroutine()` as a Prometheus gauge | Unbounded growth — the leak signature. Alert on trend, not absolute value. |
| `/debug/pprof/goroutine?debug=2` | Full stacks of every goroutine, grouped. Shows exactly which line they're parked on. |
| `SIGQUIT` to the process (`Ctrl-\`) | Same dump on the way to a crash, no pprof endpoint needed. `GOTRACEBACK=all` for full detail. |
| `GODEBUG=schedtrace=1000` | Per-second scheduler state: runnable queue depths, idle Ps, thread counts. |
| `go.uber.org/goleak` in tests | Fails a test if it leaves goroutines behind. Cheap to adopt, catches leaks at PR time. |
| Block profile (`runtime.SetBlockProfileRate`) | Where goroutines spend time blocked — surfaces contention before it becomes a hang. |

The pprof reading trick worth mentioning: goroutines blocked for a long time show their wait duration in the `debug=2` output (e.g. `goroutine 42 [chan receive, 118 minutes]`). Sorting by that number finds leaks immediately.

**Adopting `goleak` in tests is the answer that lands best** — it moves detection left, and it's a concrete thing you'd actually do rather than an observability aspiration.

## 8. Adjacent Behaviours People Confuse With This

- **The race detector (`-race`) does not detect deadlocks.** It finds unsynchronized concurrent access — the opposite failure mode. Over-synchronizing to silence it can *create* deadlocks.
- **`main` returning kills everything.** When the main goroutine returns, the program exits immediately; remaining goroutines are killed mid-flight with no deferred functions run. Not a deadlock, but the same "my goroutine never finished" symptom.
- **All goroutines in `time.Sleep` is not a deadlock** — pending timers are future work, so the detector correctly stays quiet. A program that sleeps forever just hangs.
- **`sync.WaitGroup` misuse** — `Add` called *inside* the goroutine instead of before it means `Wait` may return early, or hang if a `Done` is missed. Detected only if it's the whole program.
- **Mutex self-deadlock:** Go's `sync.Mutex` is **not reentrant**. Locking twice from the same goroutine deadlocks that goroutine permanently. Deliberate design choice — reentrant mutexes make invariant reasoning much harder, since you can't assume the lock was just acquired.

## Official Sources

- [`runtime.checkdead` in `runtime/proc.go`](https://go.dev/src/runtime/proc.go)
- [Go 1.26 release notes: goroutine leak profile](https://go.dev/doc/go1.26)
- [`runtime/pprof` documentation](https://pkg.go.dev/runtime/pprof)
