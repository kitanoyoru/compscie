# Go defer — Semantics, Open-Coded Implementation, and Gotchas

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b3a407e452d8135ad91dcc4d8a76029)

Notes from interview prep session. Companion to the panic/recover-adjacent runtime docs.

## 1. Core Guarantees

- A deferred call runs when the **surrounding function returns** — not the enclosing block, the whole function.
- Multiple defers in the same function run in **LIFO order** (last deferred, first executed) — like a stack.

## 2. The Big Gotcha: Argument Evaluation Timing

**The arguments to a deferred call (and the receiver, if it's a method call) are evaluated immediately, at the moment the `defer` statement executes** — only the actual invocation is postponed.

```go
func example() {
    x := 1
    defer fmt.Println("x was:", x) // "x was: 1" — x is copied NOW
    x = 2
    fmt.Println("x is now:", x)    // prints "x is now: 2"
}
// Output:
// x is now: 2
// x was: 1
```

**Closures behave differently:** a deferred closure (`defer func() { fmt.Println(x) }()`) captures `x` by reference and WILL see later mutations, since nothing about the captured variable is evaluated until the closure actually runs.

**Distinction:** arguments passed directly to a deferred call are evaluated now; variables captured inside a deferred closure are resolved when the closure executes.

## 3. Implementation History — Three Generations

- **Pre-1.13:** every `defer` heap-allocates a `_defer` struct (function pointer, arguments, stack/PC info), linked onto the goroutine's defer chain. Genuinely expensive, measurable per-call cost.
- **Go 1.13:** stack-allocates the `_defer` struct when possible instead of heap-allocating — moderate improvement, still not free.
- **Go 1.14+ — open-coded defers:** for the common case, the compiler **inlines the deferred call directly at each return point**, guarded by a small bitmask (1 byte, supports up to 8 defers) tracking which defers are "armed" for this execution path. No allocation, no linked list — essentially free.

**Constraint on open-coding:** only applies when a function has **at most 8 defer statements** and **none are inside a loop** — a loop could produce an unbounded, dynamically-varying defer count, which can't fit a fixed compile-time bitmask. Defers inside loops always fall back to the heap/stack-allocated linked-list mechanism.

**Interview framing ("is defer expensive?"):** Used to have a real, nontrivial cost (heap allocation per call). Since Go 1.14, the overwhelmingly common case (a handful of top-level defers, no loop) is essentially free due to open-coding. The old cost model only still applies to defers inside loops or functions with \>8 defers.

## 4. defer + Named Return Values — the recover-to-error Pattern

A deferred function runs **after** the `return` statement's expression is evaluated but **before** control actually returns to the caller — and if the function uses a **named** return value, the deferred function can still modify it during that window.

```go
func safeDivide(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r) // modifies the named return value
        }
    }()
    result = a / b // panics on b == 0
    return
}
```

Without a **named** return value, there'd be nothing for the deferred function to assign into — this is exactly why this pattern requires named returns, not just any error return type.

## 5. panic/recover Interaction With defer, Precisely

- When `panic` occurs: normal execution stops immediately, every deferred function **already registered in that frame** runs, in LIFO order.
- **`recover()` only has effect when called directly inside a deferred function** — calling it anywhere else (including a function called FROM a deferred function, one level removed) just returns `nil` and does nothing.
- If no deferred function in the current frame calls `recover()`, the panic **propagates up the call stack**, running each caller's deferred functions in turn, until something calls `recover()` or it reaches the top of the goroutine's stack — at which point the whole program crashes.

## 6. The Classic Loop Gotcha

```go
func processFiles(paths []string) error {
    for _, p := range paths {
        f, err := os.Open(p)
        if err != nil {
            return err
        }
        defer f.Close() // BUG: doesn't close until processFiles RETURNS, not per-iteration
        process(f)
    }
    return nil
}
```

Every `defer f.Close()` piles up and only executes when `processFiles` itself returns — not at the end of each loop iteration. With enough files, this can **exhaust the process's file descriptor limit** before the function ever returns.

**Fix:** wrap the loop body in its own function (so the defer's scope is that inner function, firing each iteration), or call `f.Close()` explicitly without `defer` inside the loop.

## 7. Follow-ups to Have Ready

- *"How would you detect this kind of bug in code review?"* → Any `defer` inside a `for` loop body is worth a second look by default — not automatically wrong, but it's the single most common defer-related resource leak pattern in real codebases, and exactly the shape static analysis and experienced reviewers are trained to flag on sight.
