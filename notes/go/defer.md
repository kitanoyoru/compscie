---
date: 2026-08-23
---

# Go defer

> A deferred call runs when the surrounding function returns, in LIFO order. Its arguments are evaluated immediately, when the `defer` statement executes. Since Go 1.14 the common case is compiled as an open-coded defer and is essentially free. Checked against Go 1.26.

## Questions this answers

- When exactly does a deferred call run, and in what order?
- When are the arguments of a deferred call evaluated?
- Is `defer` expensive, and what changed in Go 1.13 and 1.14?
- How does a deferred function turn a panic into an error?
- Where does `recover()` work, and where does it silently do nothing?
- Why is `defer` inside a loop a resource-leak smell?

## Notes

### Core guarantees

- A deferred call runs when the **surrounding function returns**, not at the end of the enclosing block.
- Multiple defers in the same function run in **LIFO order** (last deferred, first executed), like a stack.

### Implementation history

Three generations:

- **Before Go 1.13:** every `defer` heap-allocates a `_defer` struct (function pointer, arguments, stack and PC info), linked onto the goroutine's defer chain. This is a genuinely expensive, measurable per-call cost.
- **Go 1.13:** stack-allocates the `_defer` struct when possible instead of heap-allocating it. A moderate improvement, but still not free.
- **Go 1.14+, open-coded defers:** for the common case, the compiler **inlines the deferred call directly at each return point**. A small bitmask (1 byte, supporting up to 8 defers) tracks which defers are "armed" on this execution path. No allocation, no linked list, essentially free.

**Constraint on open-coding:** it applies only when a function has **at most 8 defer statements** and **none are inside a loop**. A loop can produce an unbounded, dynamically varying number of defers, which cannot fit a fixed compile-time bitmask. Defers inside loops always fall back to the heap- or stack-allocated linked-list mechanism.

**Interview framing ("is defer expensive?"):** it used to have a real, nontrivial cost (a heap allocation per call). Since Go 1.14, the overwhelmingly common case (a handful of top-level defers, no loop) is essentially free thanks to open-coding. The old cost model still applies only to defers inside loops or in functions with more than 8 defers.

### `defer` with named return values

A deferred function runs **after** the `return` statement's expression is evaluated but **before** control actually returns to the caller. If the function uses a **named** return value, the deferred function can still modify it during that window. This is the recover-to-error pattern:

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

Without a **named** return value there would be nothing for the deferred function to assign into. That is why this pattern requires named returns, not just any error return type.

### `panic` and `recover` with `defer`

- When a `panic` occurs, normal execution stops immediately. Every deferred function **already registered in that frame** runs, in LIFO order.
- **`recover()` only has effect when called directly inside a deferred function.** Calling it anywhere else, including in a function called _from_ a deferred function (one level removed), just returns `nil` and does nothing.
- If no deferred function in the current frame calls `recover()`, the panic **propagates up the call stack**. It runs each caller's deferred functions in turn until something calls `recover()` or it reaches the top of the goroutine's stack, at which point the whole program crashes.

## Gotchas

### Argument evaluation timing

**The arguments to a deferred call (and the receiver, if it is a method call) are evaluated immediately, when the `defer` statement executes.** Only the actual invocation is postponed.

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

**Closures behave differently.** A deferred closure (`defer func() { fmt.Println(x) }()`) captures `x` by reference and **will** see later mutations, because nothing about the captured variable is evaluated until the closure actually runs.

**Distinction:** arguments passed directly to a deferred call are evaluated now; variables captured inside a deferred closure are resolved when the closure executes.

### `defer` inside a loop

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

Every `defer f.Close()` piles up and runs only when `processFiles` itself returns, not at the end of each loop iteration. With enough files, this can **exhaust the process's file descriptor limit** before the function ever returns. A defer in a loop also defeats open-coding (see [implementation history](#implementation-history)).

**Fix:** wrap the loop body in its own function, so the defer's scope is that inner function and fires on each iteration. Alternatively, call `f.Close()` explicitly, without `defer`, inside the loop.

## Interview drills

- _"How would you detect this kind of bug in code review?"_ → Any `defer` inside a `for` loop body is worth a second look. It is not automatically wrong, but it is the most common defer-related resource-leak pattern in real codebases, and exactly the shape static analysis and experienced reviewers are trained to flag on sight. See [`defer` inside a loop](#defer-inside-a-loop).
- _"Is `defer` expensive?"_ → Not since Go 1.14 for the common case; the old cost applies to loops and more than 8 defers. See [implementation history](#implementation-history).
- _"What does this print: `x := 1; defer fmt.Println(x); x = 2`?"_ → `1`, because arguments are evaluated at the `defer` statement. See [argument evaluation timing](#argument-evaluation-timing).
- _"Why does the recover-to-error pattern need named results?"_ → The deferred function must assign into something that outlives the `return` expression. See [`defer` with named return values](#defer-with-named-return-values).

## Sources

- [The Go Specification: Defer statements](https://go.dev/ref/spec#Defer_statements)
- [Go blog: Defer, Panic, and Recover](https://go.dev/blog/defer-panic-and-recover)
- [`runtime/panic.go`](https://go.dev/src/runtime/panic.go)
- [Go 1.14 release notes](https://go.dev/doc/go1.14) (open-coded defers)
