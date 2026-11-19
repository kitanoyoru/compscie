---
date: 2026-08-23
concepts: Runtime, Production diagnostics
---

# Go Deadlock Detector

> The runtime's deadlock detector, `checkdead()`, is a blunt global check, not a cycle analyzer. It fires only when the entire program has nothing left that could ever run. Local deadlocks and goroutine leaks inside an otherwise-busy program are invisible to it. Checked against Go 1.26.

## Questions this answers

- When does `fatal error: all goroutines are asleep - deadlock!` appear, and when does it not?
- Can the detector find two goroutines stuck on each other?
- Can the fatal error be recovered?
- How do I find leaked goroutines in a live service?
- Which behaviours look like deadlocks but are not?

See [Go Channels](channels.md) for the channel internals behind this, and [Go Scheduler (GMP)](scheduler-gmp.md) for the Ms and Ps mentioned below.

## Notes

### When `checkdead()` runs

`checkdead()` is not a graph-based cycle analyzer. It is a blunt global check, invoked from the scheduling path (`schedule()`/`stopm`) at the moment **every P has run dry and no M can find any runnable goroutine anywhere**. That means nothing in any local run queue, nothing in the global queue, and nothing stealable from any P.

At that point, before quietly parking the last M, the runtime asks: **"could anything possibly wake up in the future?"**

### Decision flow

The runtime checks, in order, whether any of these could still produce future work:

- **Any M in a blocking syscall?** It could return and hand back a runnable G.
- **Any pending timers** (`time.Sleep`, `time.After`)? One will eventually fire and wake a G.
- **Any cgo call in flight, or GC in progress?** These are also potential sources of future work.

If **all** of these are "no", the runtime concludes that nothing in the program can ever progress again and crashes with:

```text
fatal error: all goroutines are asleep - deadlock!
```

This is a **fatal error**, not a regular `panic`, so it cannot be caught with `recover()`. The runtime treats it as an unrecoverable program state.

### Global, not pairwise

`checkdead()` fires only when the **entire** program has nothing left to do. It has no concept of "goroutine A and B are deadlocked with each other." If even one other goroutine anywhere is still doing legitimate work (for example an HTTP server serving other requests), two goroutines stuck forever on a channel will **never** trigger the detector. They leak silently, invisible to the runtime.

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

**Interview framing:** the deadlock detector is a last-resort safety net for a _fully stuck_ program, not a debugging tool for partial deadlocks. In production, a stuck pair of goroutines inside an otherwise-busy service leaks silently. You would only catch it through goroutine-count metrics or a pprof goroutine profile showing an ever-growing count.

**Production monitoring tie-in:** exporting `runtime.NumGoroutine()` as a Prometheus gauge is a standard way to catch exactly this class of leak, since the runtime itself will not surface it. See [detecting leaks the runtime won't report](#detecting-leaks-the-runtime-wont-report).

### What it covers and what it doesn't

**Covers:** channel send/receive blocking, `sync.WaitGroup.Wait()`, `sync.Mutex`/`RWMutex` blocking, and `select` with no ready case and no default. Anything routed through `gopark` counts toward "is this G ever coming back."

**Doesn't cover:**

- A single blocked goroutine sitting alongside other active work (the common real-world case).
- Logical deadlocks across separate processes or distributed locks (for example two services waiting on each other via gRPC). These are entirely outside the Go runtime's visibility.

### Precision notes

A few refinements worth being precise about if pushed:

- **It counts Ms, not Ps.** `checkdead()` runs under `sched.lock` at the moment the **last M is about to park**. Its actual test is over thread counts: if there are no Ms running, none in syscalls, and no work that could produce a runnable G, the program is dead. The "every P has run dry" framing is the right intuition, but the implementation is thread-oriented.
- **Locked threads are handled specially.** Goroutines pinned via `runtime.LockOSThread` are checked separately. A runnable G locked to a parked M means the runtime starts that M rather than declaring deadlock.
- **cgo does not suppress the detector merely because the binary uses cgo.** The explicit broad exemption is for `-buildmode=c-shared` and `-buildmode=c-archive` (except wasm), because the calling non-Go program may later enter Go again. Active syscalls and cgo callbacks also affect whether the runtime can conclude that no future work exists, but an ordinary cgo-enabled executable does not automatically lose deadlock detection.
- **The netpoller counts as potential work.** A goroutine blocked on a socket read is waiting on the netpoller, so the runtime knows an event could still arrive. This is _not_ a deadlock even if nothing will ever actually be sent, which is why an idle server never trips the detector.

### Detecting leaks the runtime won't report

This is the real answer to "how do you find a stuck goroutine in a live service?", and there is now a first-party option.

#### `goroutineleak` profile (Go 1.26, experimental)

Build with `GOEXPERIMENT=goroutineleakprofile`, then inspect `/debug/pprof/goroutineleak`. The implementation is intended to be production-ready, while the API and profile format remain experimental.

It uses reachability to report a useful subset of permanently blocked goroutines, such as goroutines waiting on channels or synchronization objects that no runnable goroutine can still reach. It is intentionally conservative: synchronization objects reachable from globals or from runnable goroutine locals can hide a leak, and other classes of stuck work may not be reported. It adds no extra runtime overhead unless the profile is actively requested.

#### Established techniques

These are still the working answer today.

| Technique                                      | What it catches                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `runtime.NumGoroutine()` as a Prometheus gauge | Unbounded growth, the leak signature. Alert on trend, not absolute value.                     |
| `/debug/pprof/goroutine?debug=2`               | Full stacks of every goroutine, grouped. Shows exactly which line they're parked on.          |
| `SIGQUIT` to the process (`Ctrl-\`)            | Same dump on the way to a crash, no pprof endpoint needed. `GOTRACEBACK=all` for full detail. |
| `GODEBUG=schedtrace=1000`                      | Per-second scheduler state: runnable queue depths, idle Ps, thread counts.                    |
| `go.uber.org/goleak` in tests                  | Fails a test if it leaves goroutines behind. Cheap to adopt, catches leaks at PR time.        |
| Block profile (`runtime.SetBlockProfileRate`)  | Where goroutines spend time blocked. Surfaces contention before it becomes a hang.            |

A pprof reading trick: goroutines blocked for a long time show their wait duration in the `debug=2` output (for example `goroutine 42 [chan receive, 118 minutes]`). Sorting by that number finds leaks immediately.

**Adopting `goleak` in tests is the answer that lands best.** It moves detection left, and it is a concrete thing you would actually do rather than an observability aspiration.

## Gotchas

### Behaviours easily mistaken for deadlocks

- **The race detector (`-race`) does not detect deadlocks.** It finds unsynchronized concurrent access, the opposite failure mode. Over-synchronizing to silence it can _create_ deadlocks.
- **`main` returning kills everything.** When the main goroutine returns, the program exits immediately. Remaining goroutines are killed mid-flight with no deferred functions run. This is not a deadlock, but it shows the same "my goroutine never finished" symptom.
- **All goroutines in `time.Sleep` is not a deadlock.** Pending timers are future work, so the detector correctly stays quiet. A program that sleeps forever just hangs.
- **`sync.WaitGroup` misuse.** Calling `Add` _inside_ the goroutine instead of before it means `Wait` may return early, or hang if a `Done` is missed. It is detected only if it is the whole program. See [Go sync.WaitGroup](waitgroup.md).
- **Mutex self-deadlock.** Go's `sync.Mutex` is **not reentrant**. Locking twice from the same goroutine deadlocks that goroutine permanently. This is a deliberate design choice: reentrant mutexes make invariant reasoning much harder, since you cannot assume the lock was just acquired. See [Go sync.Mutex](mutex.md).

## Interview drills

- _"If this only catches global deadlocks, how would you detect a leaked or stuck goroutine in a live payment service?"_ → See [detecting leaks the runtime won't report](#detecting-leaks-the-runtime-wont-report):
  - `runtime.NumGoroutine()` as a monitored and alerted metric for unbounded growth.
  - Periodic `pprof` goroutine profile snapshots (`/debug/pprof/goroutine?debug=2`), which show full stack traces of every goroutine and pinpoint where they are stuck.
  - In code review, be suspicious of any channel operation without a corresponding `context.Context` cancellation path or timeout (see [Go Context](context.md)).
- _"Can you `recover()` from `all goroutines are asleep`?"_ → No, it is a fatal error. See [decision flow](#decision-flow).
- _"Why doesn't an idle HTTP server trigger the detector?"_ → The netpoller counts as potential future work. See [precision notes](#precision-notes).

## Sources

- [`runtime.checkdead` in `runtime/proc.go`](https://go.dev/src/runtime/proc.go)
- [Go 1.26 release notes: goroutine leak profile](https://go.dev/doc/go1.26)
- [`runtime/pprof` documentation](https://pkg.go.dev/runtime/pprof)
