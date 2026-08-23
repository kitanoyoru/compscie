# Go context Package — Cancellation Trees, Value Lookup, and Anti-Patterns

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b3a407e452d8178b6d8e097f369f657)

Notes from interview prep session. Companion to the channels, defer, and sync docs.

## 1. The Context Interface

```go
type Context interface {
    Deadline() (deadline time.Time, ok bool)
    Done() <-chan struct{}
    Err() error
    Value(key any) any
}
```

Everything else — `WithCancel`, `WithTimeout`, `WithDeadline`, `WithValue` — wraps a parent Context and returns a new one, building a **tree** of contexts rather than a flat structure. This tree shape underlies everything below.

## 2. Cancellation Propagation — Why Done() Closes Rather Than Sends

`Done()` returns a `<-chan struct{}` that gets **closed**, never a value sent through it. This directly follows from channel semantics covered elsewhere: closing a channel wakes EVERY goroutine parked on it, while sending a value only ever satisfies ONE waiting receiver. Since potentially many goroutines across a call tree independently do `select { case <-ctx.Done(): ... }`, closing is the only way to notify all of them simultaneously with a single operation.

**`cancelCtx` internally maintains a `children map[canceler]struct{}`.** Calling the returned `cancel()` function walks that map and recursively cancels every child, closing their Done() channels and cancelling their own children in turn. **Cancellation flows strictly downward** through the tree — never upward or sideways. A child's cancellation never affects its parent or siblings.

## 3. WithValue — a Linked-List Lookup, Not a Map

`WithValue(parent, key, val)` returns a `valueCtx` wrapping just ONE key/value pair plus a pointer to its parent:

```go
type valueCtx struct {
    Context
    key, val any
}
```

Calling `.Value(key)` **walks up the parent chain one level at a time**, comparing the requested key against each valueCtx's stored key, until it finds a match or runs out of parents (returns nil). **Lookup cost is O(depth of the context tree)**, not O(1) — chaining WithValue ten deep means the tenth lookup does up to ten comparisons. Rarely a real perf problem since context trees are usually shallow, but worth knowing precisely.

## 4. WithTimeout / WithDeadline — Built on WithCancel Plus a Timer

`WithTimeout(parent, d)` = `WithDeadline(parent, time.Now().Add(d))`. `WithDeadline` itself is a `cancelCtx` PLUS a `time.AfterFunc` timer scheduled to fire at the deadline and call `cancel()` automatically.

**Key behavioral difference from manual WithCancel:** `Err()` reports:

- **`context.DeadlineExceeded`** when the timer fired it
- **`context.Canceled`** when something called the cancel function explicitly

Genuinely useful in production for distinguishing "this actually timed out" from "something upstream aborted it early" in logs/metrics.

## 5. Why the Returned cancel() Must ALWAYS Be Called

The single most commonly missed real-world gotcha — `go vet`'s `lostcancel` check exists specifically to catch it:

```go
func doWork(parent context.Context) {
    ctx, cancel := context.WithTimeout(parent, 5*time.Second)
    // BUG: cancel is never called
    result := doSomething(ctx)
    use(result)
}
```

Even though the timer eventually fires and cleans up after 5 seconds, **failing to call `cancel()` explicitly means the child context — and its timer resource — lingers in the parent's children map for the full duration**, even if `doSomething` finishes in 5 milliseconds. In a hot path processing many requests/sec, this is a steady accumulation of live timers and unreleased context tree nodes — a real, measurable resource leak.

**Fix:** `defer cancel()` immediately after creating the context, unconditionally, regardless of how the function exits.

## 6. Two Anti-Patterns to Flag Unprompted

**1. Storing a Context in a struct field.** Go convention: `context.Context` is always the FIRST parameter of a function, named `ctx`, threaded explicitly through the call chain — never stored as a struct field. Storing it hides the request's scope and risks a stale context (from an earlier request) silently leaking into a later, unrelated operation on the same struct instance.

**2. Using context.Value for required business parameters.** `Value` is untyped (`any` key, `any` value) and bypasses compile-time type checking. Intended for cross-cutting, request-scoped metadata that genuinely needs to cross API boundaries you don't control (trace IDs, auth principals, deadlines) — NOT as a backdoor for passing parameters a function actually needs. If a function requires a value to operate correctly, it belongs as an explicit typed parameter; burying it in `ctx.Value("userID")` trades compile-time safety for convenience and hides the function's real dependencies from its signature.

## 7. Follow-ups to Have Ready

- *"How would you build a payment-processing pipeline that respects a per-request deadline as it fans out across several downstream service calls?"* → Derive `WithTimeout` once at the entry point, pass that single ctx down through every downstream call (each doing its own `select` on `ctx.Done()`, or passing ctx into an HTTP/gRPC client that honors it natively) — enforces the deadline consistently everywhere without each layer independently tracking/recomputing a remaining-time budget.
- *"How does Value() actually find the value?"* → Linear walk up the parent chain comparing keys — not a hashmap lookup.
