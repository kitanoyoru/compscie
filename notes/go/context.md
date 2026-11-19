---
date: 2026-08-23
concepts: Concurrency
---

# Go Context

> `context.Context` carries cancellation, deadlines, and request-scoped values across API boundaries. It is a control signal, not a bag of optional parameters. Contexts form a tree: cancelling a parent cancels every descendant, and never the other way around. Checked against Go 1.26.

## Questions this answers

- Who owns a cancel function, and what happens if nobody calls it?
- Why does `Done()` return a channel that is closed rather than one that receives a value?
- How does `Value()` find a value, and what does it cost?
- How do I tell a timeout from an explicit cancel, or a domain abort from a client disconnect?
- When is `WithoutCancel` or `AfterFunc` the right tool?
- Which context patterns leak goroutines?

## Notes

### Interface

```go
type Context interface {
    Deadline() (deadline time.Time, ok bool)
    Done() <-chan struct{}
    Err() error
    Value(key any) any
}
```

`WithCancel`, `WithTimeout`, `WithDeadline`, and `WithValue` each wrap a parent context and return a new one. The result is a **tree** of contexts, not a flat structure. Everything below follows from that shape.

### API ownership rules

- Accept `ctx context.Context` as the **first parameter**, named `ctx`.
- Never pass `nil`; use `context.Background()` or `context.TODO()`.
- Do not store a context in a long-lived struct unless the API truly represents one operation (see [context in a struct](#context-stored-in-a-struct)).
- The function that creates a cancelable child owns the returned cancel function and should call it, normally with `defer cancel()` (see [lost cancel](#lost-cancel)).
- Values are for request-scoped metadata, not required function arguments (see [`Value` for required parameters](#value-for-required-parameters)).

### Cancellation tree

`WithCancel`, `WithDeadline`, and `WithTimeout` create a child linked to its parent. Cancelling a parent cancels every descendant. Cancelling a child does not cancel its parent or siblings.

```go
func Handle(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, 250*time.Millisecond)
	defer cancel()
	return callDependency(ctx)
}
```

Internally, a `cancelCtx` keeps a `children map[canceler]struct{}`. Calling the returned `cancel()` walks that map and recursively cancels every child. Each child's `Done()` channel is closed, and its own children are cancelled in turn. **Cancellation flows strictly downward** through the tree, never upward or sideways.

Calling `cancel` also releases the child's timer and removes it from the parent's map promptly.

### Why `Done()` closes instead of sending

`Done()` returns a `<-chan struct{}` that gets **closed**. A value is never sent through it. This follows from channel semantics (see [Go Channels](channels.md)): closing a channel wakes **every** goroutine parked on it, while a send satisfies only **one** waiting receiver.

Many goroutines across a call tree independently run `select { case <-ctx.Done(): ... }`. Closing is the only way to notify all of them with a single operation.

### Observing cancellation

```go
func worker(ctx context.Context, jobs <-chan Job) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case job, ok := <-jobs:
			if !ok { return nil }
			if err := process(ctx, job); err != nil { return err }
		}
	}
}
```

`Done` is closed when cancellation occurs, so any number of goroutines can observe it. `Err` returns `context.Canceled` or `context.DeadlineExceeded`.

### Cancellation causes

Use `WithCancelCause` when callers need the domain reason behind cancellation:

```go
ctx, cancel := context.WithCancelCause(parent)
cancel(ErrRiskLimit)

if errors.Is(context.Cause(ctx), ErrRiskLimit) {
	// distinguish domain cancellation from a client disconnect
}
```

`ctx.Err()` remains the stable sentinel; `context.Cause(ctx)` returns the recorded cause. `WithDeadlineCause` and `WithTimeoutCause` attach a cause when their deadline expires.

### `AfterFunc`

`context.AfterFunc(ctx, f)` runs `f` in its own goroutine after cancellation. The returned stop function reports whether it prevented the callback from starting. It does **not** wait for an already-started callback to finish, so coordinate separately if completion matters.

Make `f` idempotent or otherwise safe against races with normal cleanup.

### `WithoutCancel`

`context.WithoutCancel(parent)` keeps parent values but deliberately breaks deadline and cancellation propagation. Its `Done` channel is nil, and it has no deadline, error, or cancellation cause.

Use it sparingly for bounded work that must outlive the request, then add a new explicit timeout:

```go
detached := context.WithoutCancel(reqCtx)
ctx, cancel := context.WithTimeout(detached, 2*time.Second)
defer cancel()
```

Do not use it to make unbounded background work invisible to lifecycle management.

### Deadlines and timeouts

`WithTimeout(parent, d)` is `WithDeadline(parent, time.Now().Add(d))`. `WithDeadline` is a `cancelCtx` plus a `time.AfterFunc` timer that fires at the deadline and calls `cancel()` automatically. For timer semantics see [Go Timers and Tickers](timers-tickers.md).

This differs from a manual `WithCancel` in what `Err()` reports:

- **`context.DeadlineExceeded`** when the timer fired the cancellation.
- **`context.Canceled`** when something called the cancel function explicitly.

That distinction is useful in production logs and metrics: "this actually timed out" versus "something upstream aborted it early".

### Values

`WithValue(parent, key, val)` returns a `valueCtx` that wraps just **one** key/value pair plus a pointer to its parent:

```go
type valueCtx struct {
    Context
    key, val any
}
```

`.Value(key)` **walks up the parent chain one level at a time**, comparing the requested key with each `valueCtx`'s stored key. It stops at a match, or returns nil when it runs out of parents. This is a linked-list lookup, not a map: **cost is O(depth of the context tree)**. Chaining `WithValue` ten deep means a lookup can do up to ten comparisons. That is rarely a real performance problem because context trees are usually shallow, but it is worth knowing precisely.

Use an unexported key type so keys from different packages cannot collide, which a plain string key cannot guarantee. Keep values small, immutable, and request-scoped. Required dependencies belong in explicit parameters or struct fields.

### Testing

Avoid `time.Sleep` as synchronization. Use explicit channels to signal that a goroutine reached a point, then cancel and assert it exits. For deadline behavior, keep durations generous enough for loaded CI, or inject a clock at your own abstraction boundary.

## Gotchas

### Lost cancel

The most commonly missed gotcha, and the reason `go vet` has a `lostcancel` check:

```go
func doWork(parent context.Context) {
    ctx, cancel := context.WithTimeout(parent, 5*time.Second)
    // BUG: cancel is never called
    result := doSomething(ctx)
    use(result)
}
```

The timer eventually fires and cleans up after 5 seconds. But without an explicit `cancel()`, the child context and its timer stay linked in the parent's children map for that whole time, even if `doSomething` finishes in 5 milliseconds. On a hot path handling many requests per second, this is a steady build-up of live timers and unreleased context-tree nodes: a real, measurable resource leak. Forgetting `cancel` retains resources until the parent is cancelled or the deadline expires. `go vet` catches many lost-cancel paths.

**Fix:** `defer cancel()` immediately after creating the context, unconditionally, regardless of how the function exits.

### Context stored in a struct

Go convention: `context.Context` is the first parameter of a function, named `ctx`, and is threaded explicitly through the call chain. Storing it in a struct field hides the request's scope. It also risks a stale context from an earlier request silently leaking into a later, unrelated operation on the same struct instance.

### `Value` for required parameters

`Value` is untyped (`any` key, `any` value) and bypasses compile-time type checking. It is meant for cross-cutting, request-scoped metadata that must cross API boundaries you do not control, such as trace IDs and auth principals. It is not a backdoor for parameters a function actually needs.

If a function requires a value to work correctly, make it an explicit typed parameter. Burying it in `ctx.Value("userID")` trades compile-time safety for convenience and hides the function's real dependencies from its signature.

### Leak and shutdown patterns

- A sender can leak if the receiver returns on cancellation. Select on both the result channel and `ctx.Done`, or size the channel for the exact ownership protocol.
- Every launched goroutine needs a termination path you can explain.
- Bound shutdown with a deadline.
- Preserve causes across layers when they help operators distinguish timeout, client cancellation, and domain aborts.

## Review checklist

- [ ] Context is the first parameter and is never nil.
- [ ] Every derived cancel function is called.
- [ ] Blocking operations receive the context or select on `Done`.
- [ ] Detached work gets a fresh, bounded lifetime.
- [ ] Context values are request metadata, not hidden dependencies.
- [ ] Tests prove goroutines exit after cancellation.

## Interview drills

- _"How would you build a payment-processing pipeline that respects a per-request deadline as it fans out across several downstream service calls?"_ → Derive `WithTimeout` once at the entry point and pass that single ctx through every downstream call. Each call either does its own `select` on `ctx.Done()` or passes ctx into an HTTP/gRPC client that honors it natively. The deadline is then enforced consistently, without each layer tracking a remaining-time budget. See [deadlines and timeouts](#deadlines-and-timeouts).
- _"How does `Value()` actually find the value?"_ → A linear walk up the parent chain comparing keys, not a hashmap lookup. See [values](#values).
- _"Why is `Done()` a closed channel instead of a sent value?"_ → Closing wakes every waiter; a send wakes one. See [why `Done()` closes](#why-done-closes-instead-of-sending).
- _"How do you tell a timeout from an explicit cancel?"_ → `Err()` is `DeadlineExceeded` or `Canceled`; use `Cause` for the domain reason. See [cancellation causes](#cancellation-causes).

## Sources

- [Package context](https://pkg.go.dev/context)
- [Go blog: Context](https://go.dev/blog/context)
- [`context` source](https://go.dev/src/context/context.go)
