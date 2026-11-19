---
date: 2026-08-23
---

# Go sync.WaitGroup

> A `WaitGroup` packs a task counter and a waiter count into one 64-bit atomic word, so `Add`, `Done`, and `Wait` need no separate lock. `Wait` returns when the counter reaches zero. Prefer `WaitGroup.Go` for new task groups, and use explicit `Add`/`Done` when the lifecycle requires it. Checked against Go 1.26.

## Questions this answers

- How does one atomic word hold both the counter and the waiters?
- Why must `Add` happen before `Wait`, and what goes wrong if it does not?
- Why is copying a `WaitGroup` a bug?
- Is it safe to reuse a `WaitGroup` for a second round?
- What does `WaitGroup.Go` do, and when should you use it?
- What does `Wait` guarantee under the memory model?

## Notes

### Struct layout

```go
type WaitGroup struct {
    noCopy noCopy         // vet-only marker; see "Copying a WaitGroup after first use"
    state  atomic.Uint64  // high 32 bits = counter, low 32 bits = waiter count
    sema   uint32         // semaphore waiters park on
}
```

As with the [`Mutex` state word](mutex.md#state-word) and the [`RWMutex` sign trick](rwmutex.md), `WaitGroup` packs two logically separate numbers into a single 64-bit word. `Add`, `Done`, and `Wait` can then all operate with a single atomic CAS or add, instead of needing a separate lock to keep the counter and the waiter count consistent.

### Mechanics

**`Add(delta)`** (and `Done()`, which is just `Add(-1)`):

1. Atomically add `delta << 32` to `state` in one CAS.
2. If the resulting counter is negative, **panic** with `"sync: negative WaitGroup counter"`. This is the classic "called `Done()` more times than `Add()`" bug.
3. If the counter just reached zero and there is a nonzero waiter count, this call releases every parked waiter. It atomically clears the waiter count and calls the runtime semaphore release once per waiter.

**`Wait()`:**

1. Read `state`. If the counter portion is already 0, return immediately, with no parking and no semaphore involvement.
2. Otherwise, atomically increment the waiter-count portion by 1 (CAS loop), then park on the semaphore (`runtime_Semacquire`) until a `Done()` call brings the counter to zero and releases it.

### Reuse across rounds

Yes, a `WaitGroup` can be reused for a second "round" of `Add`/`Wait` after the first round's `Wait()` has returned, but only once that round has fully completed. Do not start `Add`ing for round 2 while any goroutine from round 1 might still be racing to call `Done()`, and never while a `Wait()` call might still be observing the transitional state. This is the same ordering rule as [Add and Wait ordering](#add-and-wait-ordering), applied across rounds.

### `WaitGroup.Go`

Current Go provides `wg.Go(f)` for the common task-group pattern. It starts `f` in a new goroutine and accounts for it automatically:

```go
var wg sync.WaitGroup
for _, job := range jobs {
	wg.Go(func() { process(job) }) // per-iteration job since Go 1.22; no copy needed
}
wg.Wait()
```

The function passed to `Go` must not panic. When the group is empty, `Go` must happen before the `Wait` it is meant to join. Once the group is non-empty, a task may safely start additional tasks with `Go`.

Prefer `Go` for task ownership. Keep explicit `Add`/`Done` accounting for callbacks or lifecycles where the goroutine is launched elsewhere.

### Memory-model edge

A call to `Done` is synchronized before the return of a `Wait` that it unblocks. That is what makes writes performed by completed workers visible after `Wait` returns. See [Go Memory Model](memory-model.md).

## Gotchas

### Add and Wait ordering

**Rule (from the Go docs, worth stating precisely):** calls to `Add` with a positive delta that start when the counter is zero must happen before the corresponding `Wait` call.

```go
// CORRECT: Add() for all goroutines happens before Wait()
var wg sync.WaitGroup
for i := 0; i < n; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        doWork()
    }()
}
wg.Wait()
```

```go
// WRONG / RACY: Add() called from inside a goroutine that might race with Wait()
var wg sync.WaitGroup
go func() {
    wg.Add(1)   // could run AFTER Wait() has already seen counter==0 and returned
    defer wg.Done()
    doWork()
}()
wg.Wait()
```

**Symptom:** `Wait()` returns before the work finishes. The caller thinks all work is done when it is not.

**Cause:** `Wait()` observed the counter at 0 before the late `Add(1)` executed. If this pattern reuses a `WaitGroup` across rounds, the runtime can detect actual state corruption and panic with `"sync: WaitGroup misuse: Add called concurrently with Wait"`.

**Fix:** all `Add` calls for a given round must complete before that round's `Wait` is called, never interleaved. Or use [`WaitGroup.Go`](#waitgroupgo), which does the accounting for you.

### Copying a WaitGroup after first use

The `noCopy` field has no functional methods. It exists purely so `go vet` can detect a struct containing it being passed or assigned **by value**:

```go
func worker(wg sync.WaitGroup) { // BUG: wg is a COPY, go vet will flag this
    defer wg.Done()
    ...
}
```

**Why it is a real bug:** a copy snapshots the `state` word at that instant. The goroutine mutating its copy's counter has zero effect on the original `WaitGroup` that the rest of the program is waiting on. `Wait()` on the original can hang forever (waiting for a `Done()` that will never arrive on _its_ copy), or produce undefined behavior depending on timing.

**Fix:** always pass `*sync.WaitGroup` (a pointer) into any function or closure that needs to call `Done()` on the shared instance.

## Interview drills

- _"Why panic on a negative counter?"_ → it signals more completions than registered tasks. Hiding it would turn a lifecycle bug into silent corruption. See [mechanics](#mechanics).
- _"Add/Done or Go?"_ → prefer `Go` for task ownership. Keep explicit accounting for callbacks or lifecycles where the goroutine is launched elsewhere. See [`WaitGroup.Go`](#waitgroupgo).
- _"Why can Wait return early?"_ → `Add` ran after `Wait` saw zero. See [Add and Wait ordering](#add-and-wait-ordering).
- _"Why does passing a WaitGroup by value hang?"_ → the callee decrements a copy. See [copying a WaitGroup after first use](#copying-a-waitgroup-after-first-use).

## Sources

- [`sync.WaitGroup` documentation](https://pkg.go.dev/sync#WaitGroup)
- [Public `sync.WaitGroup` source](https://go.dev/src/sync/waitgroup.go)
- [The Go Memory Model](https://go.dev/ref/mem)
