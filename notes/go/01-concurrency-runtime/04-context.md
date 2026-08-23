# 🧭 Go Context — Cancellation, Deadlines, and Ownership

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b2a407e452d81af9e4bd9daae42963e)

> 🧭 `context.Context` carries cancellation, deadlines, and request-scoped values across API boundaries. It is a control signal—not a bag of optional parameters.

> ✅ Reviewed against the **Go 1.26** `context` package on 4 Aug 2026.

## 1. API Ownership Rules

- Accept `ctx context.Context` as the **first parameter**.
- Do not store a context in a long-lived struct unless the API truly represents one operation.
- Never pass `nil`; use `context.Background()` or `context.TODO()`.
- The function that creates a cancelable child owns the returned cancel function and should call it, normally with `defer cancel()`.
- Values are for request-scoped metadata, not required function arguments.

## 2. The Cancellation Tree

`WithCancel`, `WithDeadline`, and `WithTimeout` create a child linked to its parent. Canceling a parent cancels every descendant. Canceling a child does not cancel its parent or siblings.

```go
func Handle(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, 250*time.Millisecond)
	defer cancel()
	return callDependency(ctx)
}
```

Calling `cancel` releases the child's timer and parent linkage promptly. Forgetting it can retain resources until the parent is canceled or the deadline expires; `go vet` checks many lost-cancel paths.

## 3. Observe Cancellation Correctly

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

## 4. Cancellation Causes

Use `WithCancelCause` when callers need the domain reason behind cancellation:

```go
ctx, cancel := context.WithCancelCause(parent)
cancel(ErrRiskLimit)

if errors.Is(context.Cause(ctx), ErrRiskLimit) {
	// distinguish domain cancellation from a client disconnect
}
```

`ctx.Err()` remains the stable sentinel; `context.Cause(ctx)` returns the recorded cause. `WithDeadlineCause` and `WithTimeoutCause` attach a cause when their deadline expires.

## 5. `AfterFunc`

`context.AfterFunc(ctx, f)` runs `f` in its own goroutine after cancellation. The returned stop function reports whether it prevented the callback from starting. It does **not** wait for an already-started callback to finish, so coordinate separately if completion matters.

Make `f` idempotent or otherwise safe against races with normal cleanup.

## 6. `WithoutCancel`

`context.WithoutCancel(parent)` keeps parent values but deliberately breaks deadline and cancellation propagation. Its `Done` channel is nil, and it has no deadline, error, or cancellation cause.

Use it sparingly for bounded work that must outlive the request, then add a new explicit timeout:

```go
detached := context.WithoutCancel(reqCtx)
ctx, cancel := context.WithTimeout(detached, 2*time.Second)
defer cancel()
```

Do not use it to make unbounded background work invisible to lifecycle management.

## 7. Values Without String-Key Collisions

Use an unexported key type. Keep values small, immutable, and request-scoped. Required dependencies belong in explicit parameters or struct fields.

## 8. Leak and Shutdown Patterns

- A sender can leak if the receiver returns on cancellation. Select on both the result channel and `ctx.Done`, or size the channel for the exact ownership protocol.
- Every launched goroutine needs a termination path you can explain.
- Bound shutdown with a deadline.
- Preserve causes across layers when they help operators distinguish timeout, client cancellation, and domain aborts.

## 9. Testing

Avoid `time.Sleep` as synchronization. Use explicit channels to signal that a goroutine reached a point, then cancel and assert it exits. For deadline behavior, keep durations generous enough for loaded CI or inject a clock at your own abstraction boundary.

## Review Checklist

- [ ] Context is the first parameter and is never nil.
- [ ] Every derived cancel function is called.
- [ ] Blocking operations receive the context or select on `Done`.
- [ ] Detached work gets a fresh, bounded lifetime.
- [ ] Context values are request metadata, not hidden dependencies.
- [ ] Tests prove goroutines exit after cancellation.

## Official Sources

- [Package context](https://pkg.go.dev/context)
- [Go blog: Context](https://go.dev/blog/context)
- [`context` source](https://go.dev/src/context/context.go)
