---
date: 2026-08-23
concepts: Concurrency
---

# Go sync.RWMutex

> `RWMutex` allows many concurrent readers or one writer, and it prefers writers. Once a writer arrives, new readers queue behind it so the writer can eventually acquire the lock. A single signed counter, `readerCount`, carries both the reader count and the "writer is waiting" signal. Checked against Go 1.26.

## Questions this answers

- How does `RWMutex` track readers and a waiting writer with one counter?
- Why does a waiting writer block new readers?
- Why does a recursive `RLock` deadlock?
- When is `RWMutex` actually worth it over a plain `Mutex`?
- Can you upgrade a read lock to a write lock?

## Notes

### Struct layout

```go
type RWMutex struct {
    w           Mutex   // ensures only one writer at a time
    writerSem   uint32  // writer parks here waiting for active readers to finish
    readerSem   uint32  // readers park here waiting for an active writer to finish
    readerCount atomic.Int32 // number of active/pending readers; negative = a writer is waiting/holds the lock
    readerWait  atomic.Int32 // count of readers a waiting writer still needs to drain
}
```

**Core trick:** `readerCount` doubles as both a live counter and a signal, using its sign bit. The embedded `w` is a plain [Go sync.Mutex](mutex.md).

### Lifecycle

**While `readerCount` >= 0 (no writer waiting):**

- `RLock()`: atomically +1. Proceeds immediately if the result is >= 0.
- `RUnlock()`: atomically -1.

**When a writer calls `Lock()`:**

1. Acquire the embedded `w` mutex. This guarantees only one writer at a time attempts acquisition. Other writers block here via normal `sync.Mutex` behavior.
2. Atomically subtract a large constant (`rwmutexMaxReaders`, `1<<30`) from `readerCount`. If there were `N` active readers, the result becomes `N - rwmutexMaxReaders`: negative, with the magnitude still encoding how many readers were active.
3. If that reveals active readers were present (`r != 0`), store `r` into `readerWait` and park the writer on `writerSem`.
4. Each active reader's `RUnlock()`, seeing the now-negative counter, decrements `readerWait`. The reader that brings it to zero wakes the writer.

**`Unlock()`:**

1. Add the constant back to `readerCount`, restoring it positive.
2. Wake every reader currently parked on `readerSem`. There may be several who arrived while the writer was waiting or holding the lock.
3. Release the embedded `w` mutex, allowing the next writer to proceed.

### Why the writer flips the sign immediately

The writer announces its presence **before** any existing readers have finished. The moment `readerCount` goes negative, every **new** `RLock()` call blocks, even though the writer is still waiting for old readers to drain.

**This is what prevents writer starvation.** Without it, a continuous stream of overlapping readers could keep `readerCount` above zero forever, and a naive "wait until zero" writer would never get a turn. By claiming priority immediately, the writer guarantees it proceeds after (at most) the readers that were already active when it arrived. No new reader can jump the queue once a writer is waiting.

### When RWMutex is worth it

`RWMutex` has **more overhead per operation** than a plain `Mutex` (more atomic operations, more bookkeeping). It is a net loss unless reads are both **frequent** and **held long enough** that allowing concurrent readers is a real win. For a hot path with very short critical sections and infrequent contention, a plain `Mutex` can outperform `RWMutex` despite conceptually allowing less concurrency.

**Interview framing:** "more reads than writes" alone does not automatically justify `RWMutex`. It depends on the shape of the access pattern (read duration, contention level).

### Memory-model and API edges

- For any call to `RWMutex.RLock`, there exists an earlier `Unlock` synchronized before that `RLock`, and the corresponding `RUnlock` is synchronized before a later `Lock`. See [Go Memory Model](memory-model.md#core-synchronization-edges).
- A failed `TryLock` or `TryRLock` has no synchronizing effect. Correct uses are rare, and they are not a general contention optimization.
- `RWMutex` must not be copied after first use, and it cannot be upgraded or downgraded atomically between read and write modes.

## Gotchas

### Recursive `RLock` deadlock

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

**Symptom:** the program hangs. It happens rarely and only under load, because it needs a writer to arrive in a narrow window.

**Cause:** another goroutine calls `mu.Lock()` (a writer) in the gap between `outer()`'s `RLock()` and `inner()`'s `RLock()`.

- The writer's `Lock()` has already flipped `readerCount` negative and is waiting for the _first_ `RLock` to release.
- `inner()`'s `RLock()` call sees the negative counter and blocks too, **on the very same goroutine holding the first read lock**.
- That goroutine can never reach its `RUnlock()` calls because it is stuck on its own second `RLock()`.
- Deadlock: the writer waits on the reader, the reader (second call) waits on the writer, and nothing moves.

**Real-world relevance:** this is not just theoretical. It is a real production bug pattern, especially where a read-locked method calls another method that also tries to read-lock, even indirectly through a call chain.

**Fix:** do not call `RLock` recursively. Acquire the read lock once at the outermost call and have inner functions treat the already-locked state as a given (do not re-lock). Alternatively, restructure so `inner()` does not need its own independent lock acquisition.

## Interview drills

- _"How would you fix the recursive RLock example?"_ → acquire once at the outer call and avoid independent inner acquisition. See [recursive `RLock` deadlock](#recursive-rlock-deadlock).
- _"Would you always reach for RWMutex when you have more reads than writes?"_ → no. Read duration and actual contention matter more than the raw read/write ratio. See [when RWMutex is worth it](#when-rwmutex-is-worth-it).
- _"Can I upgrade RLock to Lock?"_ → no. Releasing and reacquiring creates a gap where the invariant can change. See [memory-model and API edges](#memory-model-and-api-edges).
- _"How does a writer avoid starvation?"_ → it flips `readerCount` negative immediately, so new readers block. See [why the writer flips the sign immediately](#why-the-writer-flips-the-sign-immediately).

## Sources

- [`sync.RWMutex` documentation](https://pkg.go.dev/sync#RWMutex)
- [Public `sync.RWMutex` source](https://go.dev/src/sync/rwmutex.go)
- [The Go Memory Model](https://go.dev/ref/mem)
