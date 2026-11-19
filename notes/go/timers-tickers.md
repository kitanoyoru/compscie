---
date: 2026-08-23
---

# Go Timers and Tickers

> Timers model a one-shot event; tickers model repeated events. Own their lifetime explicitly when you need reset, cancellation, or testability. Checked against Go 1.26. The important version boundary: timer channels became synchronous in Go 1.23.

## Questions this answers

- Which tool fits: `time.After`, `NewTimer`, `AfterFunc`, `NewTicker`, or a context deadline?
- Do I still need to drain a timer channel before `Reset`?
- Is `time.After` still a garbage-collection leak?
- Does `Stop` close the channel?
- What does a ticker do when the receiver is slow?

## Notes

### Choose the smallest tool

| Need                                  | Use                                    |
| ------------------------------------- | -------------------------------------- |
| One simple delay in a `select`        | `time.After(d)`                        |
| Cancelable or reusable one-shot timer | `time.NewTimer(d)`                     |
| Run a callback later                  | `time.AfterFunc(d, f)`                 |
| Repeated cadence                      | `time.NewTicker(d)`                    |
| Request-scoped deadline               | `context.WithTimeout` / `WithDeadline` |

For request-scoped deadlines see [Go Context](context.md#deadlines-and-timeouts).

### Go 1.23+ timer channel semantics

For modules declaring Go 1.23 or later, channels created by `NewTimer` are **unbuffered**. After `Stop` or `Reset` returns, a receive cannot observe a stale value from the previous timer configuration.

Before Go 1.23, timer channels were buffered. Safe reset patterns often required checking `Stop` and draining a pending value. That historical recipe should not be repeated as universal current advice.

The compatibility switch `GODEBUG=asynctimerchan=1` restores the old behavior temporarily. It is scheduled for removal in Go 1.27.

### Garbage collection

Since Go 1.23, the garbage collector can recover unreferenced, unstopped timers and tickers. The old advice "always use `NewTimer` instead of `time.After` so the timer can be stopped and collected" is obsolete.

Still use an owned timer when you need to cancel pending work, reset it, or make lifetime obvious.

### Reset a timer

```go
timer := time.NewTimer(backoff)
defer timer.Stop()

for {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		if err := attempt(ctx); err == nil { return nil }
		timer.Reset(nextBackoff())
	}
}
```

On current semantics, `Reset` guarantees that future receives correspond to the new configuration. `Reset` returns whether the timer had been active; most loops do not need that boolean.

### Tickers

```go
ticker := time.NewTicker(30 * time.Second)
defer ticker.Stop()

for {
	select {
	case <-ctx.Done():
		return
	case now := <-ticker.C:
		refresh(now)
	}
}
```

Tickers adjust for slow receivers by dropping ticks. They do not queue every missed interval. Use `Reset` to change the period; the duration must be positive.

### Ownership patterns

- The function that creates a timer or ticker should normally stop it.
- Prefer `context` when the semantic requirement is "this operation has a deadline."
- Avoid one ticker per item in an unbounded collection; centralize scheduling when scale demands it.
- If a callback touches shared state, synchronize it like any other goroutine.

### Testing time-dependent code

- Test synchronization and state transitions with channels, not sleeps.
- Put time behind a narrow interface only where deterministic virtual time is genuinely valuable.
- Keep wall-clock deadlines at system boundaries and pass the remaining budget via context.
- When testing `Reset`, assert that events belong to the latest generation. Do not depend on exact scheduler timing.

## Gotchas

### `Stop` cancels, it does not close the channel

`Timer.Stop` prevents a pending timer from firing. It does **not** close `Timer.C`, so waiting solely on that channel after stopping can block forever.

For `AfterFunc`, `Stop` reports whether it prevented the callback from starting. A false result can mean the callback has started or already ran. `Stop` does not wait for completion.

## Interview drills

- _"Must I drain a timer channel before `Reset`?"_ → Not under Go 1.23+ synchronous timer-channel semantics; name the version boundary. See [Go 1.23+ timer channel semantics](#go-123-timer-channel-semantics).
- _"Does `Stop` close the channel?"_ → No. See [`Stop` cancels](#stop-cancels-it-does-not-close-the-channel).
- _"Does a ticker preserve every tick?"_ → No, it can drop ticks for slow receivers. See [tickers](#tickers).
- _"Is `time.After` still a GC leak?"_ → Not in Go 1.23+; choose `NewTimer` for ownership and control. See [garbage collection](#garbage-collection).

## Sources

- [Package time](https://pkg.go.dev/time)
- [Go 1.23 timer channel changes](https://go.dev/wiki/Go123Timer)
- [Go 1.23 release notes](https://go.dev/doc/go1.23)
- [`time/sleep.go`](https://go.dev/src/time/sleep.go)
