# Go sync.RWMutex — Internals and Recursive RLock

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b2a407e452d81afaa37f89f385408d4)

Notes from interview prep session. Part of the `sync` package deep dive.

> ✅ Reviewed for **Go 1.26**. The central idea is writer preference: once a writer arrives, new readers queue so the writer can eventually acquire the lock.

## 1. Struct Layout

```go
type RWMutex struct {
    w           Mutex   // ensures only one writer at a time
    writerSem   uint32  // writer parks here waiting for active readers to finish
    readerSem   uint32  // readers park here waiting for an active writer to finish
    readerCount atomic.Int32 // number of active/pending readers; negative = a writer is waiting/holds the lock
    readerWait  atomic.Int32 // count of readers a waiting writer still needs to drain
}
```

**Core trick:** `readerCount` doubles as both a live counter and a signal, using its sign bit.

## 2. Lifecycle

**While readerCount ≥ 0 (no writer waiting):**

- `RLock()`: atomically +1 — proceeds immediately if result ≥ 0
- `RUnlock()`: atomically −1

**When a writer calls `Lock()`:**

1. Acquire the embedded `w` mutex — guarantees only one writer at a time attempting acquisition (other writers block here via normal `sync.Mutex` behavior)
2. Atomically subtract a large constant (`rwmutexMaxReaders`, `1<<30`) from `readerCount`. If there were `N` active readers, result becomes `N - rwmutexMaxReaders` — negative, with magnitude still encoding how many readers were active
3. If that reveals active readers were present (`r != 0`), store `r` into `readerWait` and park the writer on `writerSem`
4. Each active reader's `RUnlock()`, seeing the now-negative counter, decrements `readerWait` — the reader that brings it to zero wakes the writer

**`Unlock()`:**

1. Add the constant back to `readerCount`, restoring it positive
2. Wake every reader currently parked on `readerSem` (may be several who arrived while the writer was waiting/holding the lock)
3. Release the embedded `w` mutex, allowing the next writer to proceed

## 3. Why the Writer Flips the Sign Immediately (Anti-Starvation)

The writer announces its presence **before** any existing readers have finished. The moment `readerCount` goes negative, every NEW `RLock()` call blocks — even though the writer is still waiting for old readers to drain.

**This is what prevents writer starvation:** without it, a continuous stream of overlapping readers could keep `readerCount` above zero forever, and a naive "wait until zero" writer would never get a turn. By claiming priority immediately, the writer guarantees it proceeds after (at most) the readers that were already active when it arrived — no new reader can jump the queue once a writer is waiting.

## 4. The Gotcha: Recursive RLock Deadlock

`RWMutex` is **not reentrant**. This produces an easy-to-write, nasty deadlock:

```go
var mu sync.RWMutex

func outer() {
    mu.RLock()
    defer mu.RUnlock()
    inner() // calls RLock again on the same goroutine
}

func inner() {
    mu.RLock()         // second RLock from the same goroutine
    defer mu.RUnlock()
    // ...
}
```

**What happens:** if another goroutine calls `mu.Lock()` (a writer) in the gap between `outer()`'s `RLock()` and `inner()`'s `RLock()`:

- The writer's `Lock()` has already flipped `readerCount` negative and is waiting for the *first* `RLock` to release
- `inner()`'s `RLock()` call sees the negative counter and blocks too — **on the very same goroutine holding the first read lock**
- That goroutine can never reach its `RUnlock()` calls because it's stuck blocked on its own second `RLock()`
- Three-way deadlock: writer waits on reader, reader (second call) waits on writer, nothing moves

**Real-world relevance:** not just theoretical — a real production bug pattern, especially where a read-locked method calls another method that also tries to read-lock, even indirectly through a call chain.

**Fix:** don't call `RLock` recursively — acquire the read lock once at the outermost call and have inner functions treat the already-locked state as a given (don't re-lock), or restructure so `inner()` doesn't need its own independent lock acquisition.

## 5. When RWMutex Is Actually Worth It vs. Plain Mutex

RWMutex has **more overhead per operation** than a plain Mutex (more atomic operations, more bookkeeping) — net loss unless reads are both **frequent** AND **held long enough** that allowing concurrent readers is a real win. For a hot path with very short critical sections and infrequent contention, a plain `Mutex` can outperform `RWMutex` despite conceptually allowing less concurrency.

**Interview framing:** "More reads than writes" alone doesn't automatically justify RWMutex — it depends on the shape of the access pattern (read duration, contention level).

## 6. Memory-Model and API Edges

- For any call to `RWMutex.RLock`, there exists an earlier `Unlock` synchronized before that `RLock`, and the corresponding `RUnlock` is synchronized before a later `Lock`.
- A failed `TryLock` or `TryRLock` has no synchronizing effect. Correct uses are rare; they are not a general contention optimization.
- `RWMutex` must not be copied after first use, and it cannot be upgraded or downgraded atomically between read and write modes.

## 7. Follow-ups to Have Ready

- *"How would you fix the recursive RLock example?"* → acquire once at the outer call and avoid independent inner acquisition.
- *"Would you always reach for RWMutex when you have more reads than writes?"* → no; read duration and actual contention matter more than the raw read/write ratio.
- *"Can I upgrade RLock to Lock?"* → no; releasing and reacquiring creates a gap where the invariant can change.

## Official Sources

- [`sync.RWMutex` documentation](https://pkg.go.dev/sync#RWMutex)
- [Public `sync.RWMutex` source](https://go.dev/src/sync/rwmutex.go)
- [The Go Memory Model](https://go.dev/ref/mem)
