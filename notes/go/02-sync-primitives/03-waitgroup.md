# Go sync.WaitGroup — State, Ordering, and WaitGroup.Go

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b2a407e452d8130996dc62bcb412c84)

Notes from interview prep session. Part of the `sync` package deep dive.

> ✅ Reviewed for **Go 1.26**. Prefer `WaitGroup.Go` for new task groups; use explicit `Add`/`Done` when the lifecycle requires it.

## 1. Struct Layout

```go
type WaitGroup struct {
    noCopy noCopy         // vet-only marker — see gotcha #2
    state  atomic.Uint64  // high 32 bits = counter, low 32 bits = waiter count
    sema   uint32         // semaphore waiters park on
}
```

Just like `Mutex`'s state word and `RWMutex`'s sign trick, `WaitGroup` packs two logically separate numbers into a single 64-bit word so `Add`, `Done`, and `Wait` can all operate with a single atomic CAS/add instead of needing a separate lock to keep the counter and waiter count consistent.

## 2. Mechanics

**`Add(delta)`** (and `Done()`, which is just `Add(-1)`):

1. Atomically add `delta << 32` to `state` in one CAS
2. If the resulting counter is negative → **panic**: `"sync: negative WaitGroup counter"` — the classic "called Done() more times than Add()" bug
3. If the counter just reached zero AND there's a nonzero waiter count → this call releases every parked waiter: atomically clears the waiter count and calls the runtime semaphore release once per waiter

**`Wait()`**:

1. Read `state`. If the counter portion is already 0, return immediately — no parking, no semaphore involvement
2. Otherwise, atomically increment the waiter-count portion by 1 (CAS loop), then park on the semaphore (`runtime_Semacquire`) until a `Done()` call brings the counter to zero and releases it

## 3. Gotcha #1 — Ordering Between Add and Wait

**Rule (from Go docs, worth stating precisely):** calls to `Add` with a positive delta that start when the counter is zero must happen before the corresponding `Wait` call.

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

If `Wait()` observes the counter at 0 before that late `Add(1)` executes, `Wait()` returns early — caller thinks all work is done when it isn't. If this pattern reuses a WaitGroup across rounds, the runtime can detect actual state corruption and panic with `"sync: WaitGroup misuse: Add called concurrently with Wait"`.

**Fix:** all `Add` calls for a given round must complete before that round's `Wait` is called — never interleaved.

## 4. Gotcha #2 — Copying a WaitGroup After First Use

The `noCopy` field has no functional methods — it exists purely so `go vet` can detect a struct containing it being passed or assigned **by value**:

```go
func worker(wg sync.WaitGroup) { // BUG: wg is a COPY, go vet will flag this
    defer wg.Done()
    ...
}
```

**Why it's a real bug:** a copy snapshots the `state` word at that instant. The goroutine mutating its copy's counter has zero effect on the original `WaitGroup` the rest of the program is waiting on — `Wait()` on the original can hang forever (waiting for a `Done()` that will never arrive on *its* copy), or produce undefined behavior depending on timing.

**Fix:** always pass `*sync.WaitGroup` (a pointer) into any function or closure that needs to call `Done()` on the shared instance.

## 5. Is Reuse Safe?

Yes — a WaitGroup can be reused for a second "round" of `Add`/`Wait` after the first round's `Wait()` has returned, but only once that round has fully completed. Don't start `Add`ing for round 2 while any goroutine from round 1 might still be racing to call `Done()`, and never while a `Wait()` call might still be observing the transitional state. Same underlying ordering rule as gotcha #1, applied across rounds.

## 6. `WaitGroup.Go`

Current Go provides `wg.Go(f)` for the common task-group pattern. It starts `f` in a new goroutine and accounts for it automatically:

```go
var wg sync.WaitGroup
for _, job := range jobs {
	job := job
	wg.Go(func() { process(job) })
}
wg.Wait()
```

The function passed to `Go` must not panic. When the group is empty, `Go` must happen before the `Wait` it is meant to join; once non-empty, a task may safely start additional tasks with `Go`.

## 7. Memory-Model Edge

A call to `Done` is synchronized before the return of a `Wait` that it unblocks. That is what makes writes performed by completed workers visible after `Wait` returns.

## 8. Follow-ups to Have Ready

- *"Why panic on a negative counter?"* → it signals more completions than registered tasks; hiding it would turn a lifecycle bug into silent corruption.
- *"Add/Done or Go?"* → prefer `Go` for task ownership; keep explicit accounting for callbacks or lifecycles where the goroutine is launched elsewhere.

## Official Sources

- [`sync.WaitGroup` documentation](https://pkg.go.dev/sync#WaitGroup)
- [Public `sync.WaitGroup` source](https://go.dev/src/sync/waitgroup.go)
- [The Go Memory Model](https://go.dev/ref/mem)
