# Go Memory Allocator — mcache/mcentral/mheap, Size Classes, Arenas

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b3a407e452d819fb7bdc0a809dd7ead)

Notes from interview prep session. Companion to "Go Garbage Collector" and "Go Escape Analysis & GC Tuning" docs.

## 1. Design Basis

Go's allocator is based on **TCMalloc** (Google's Thread-Caching Malloc) philosophy: a single global lock on every allocation would be a massive contention bottleneck given how frequently Go programs allocate. Fix: **per-P sharding** — same principle as `sync.Pool` — a lock-free fast path scoped to the current P, with progressively more coordination/locking only as needed going up the hierarchy.

## 2. The Three-Tier Hierarchy

- **`mcache`** — one per P, lock-free fast path. Holds a small cache of spans, one per size class. Only the owning P ever touches its own mcache, so `Get()` needs no lock — identical principle to sync.Pool's per-P `private` slot.
- **`mcentral`** — one per size class, shared across all Ps, protected by a lock. When a P's mcache runs out of free objects for a size class, it refills from the corresponding mcentral. Contention here is much rarer than per-allocation contention, since one refill supplies many subsequent fast-path allocations.
- **`mheap`** — global, manages the whole address space in **arenas** (64MB chunks on most 64-bit platforms) and is what actually talks to the OS (`mmap` for more virtual memory). This is also exactly where the **scavenger** operates — mheap is what calls `madvise` to hand unused pages back to the OS.

## 3. Size Classes

Go doesn't allocate arbitrary byte counts directly — roughly **70 predefined size classes** (8B, 16B, 24B, 32B, 48B... up to 32KB). Any allocation request is **rounded up to the nearest size class**. An `mspan` is a run of one or more 8KB pages, subdivided into equal-size slots for exactly one size class, with a free list/bitmap tracking used slots.

**Why fixed size classes instead of exact-size allocation?** Space-vs-simplicity tradeoff: rounding up wastes a little memory per object (internal fragmentation — e.g. a 20-byte request rounds up to the 24-byte class), but makes free-list bookkeeping enormously simpler and faster — every slot in a span is identical size, so alloc/dealloc is just pop/push from a free list, no search for a fitting hole, no external fragmentation to manage.

## 4. Three Allocation Paths (routed by mallocgc)

1. **Tiny allocator** (objects \< 16 bytes, no pointers): multiple small allocations get packed together into a single 16-byte block per P, amortizing per-object bookkeeping overhead. Targets things like small strings or tiny structs where slot overhead would otherwise dominate actual data size.
2. **Small object path** (16 bytes – 32KB): normal `mcache → mcentral → mheap` fallback chain.
3. **Large object path** (\> 32KB): goes directly to `mheap`, allocated in whole pages, completely bypassing mcache and mcentral — rare enough that per-P caching machinery wouldn't pay for itself.

## 5. scan vs noscan Spans — Ties Directly to GC

The allocator keeps spans containing **pointer-free data** (`[]byte` backing arrays, plain numeric slices, string data) in **separate spans** from ones containing objects with pointers. Since the GC's tri-color mark phase only needs to trace pointers, a **noscan span can be skipped entirely** during marking — the GC doesn't even look inside it.

**Production relevance:** for a system moving lots of raw byte buffers (serialized transaction data, hashes, etc.), this is a real, meaningful reduction in GC scan work — a direct consequence of the compiler/allocator cooperating based on the same escape-analysis-derived type information covered in the escape analysis doc.

## 6. Arenas

**What they are:** how `mheap` manages heap virtual address space in large, fixed-size chunks — **64MB each on most 64-bit platforms** (4MB on 32-bit systems, where address space is more constrained). Instead of asking the OS for memory in small increments each time the heap grows, Go reserves/maps address space one arena at a time; everything else (spans, pages) is carved out of arenas.

**What an arena contains:** represented internally by a `heapArena` struct holding metadata for every 8KB page inside that 64MB range:

- A pointer to the `mspan` that currently owns that page (fast lookup from any address → span → size class → object)
- Bits indicating whether that region is `scan` (contains pointers) or `noscan` — directly enables the GC skip-scanning behavior above

**The lookup problem arenas solve:** 64-bit virtual address space is enormous, but real heap usage is sparse — far too large for one flat metadata array. Go uses a **multi-level lookup structure** (conceptually like CPU page tables): high bits of an address index into a sparse top-level table pointing to the specific heapArena covering that address. Makes "which arena does this pointer belong to" a fast, small number of indexed lookups regardless of how spread out actual memory usage is.

**When arenas are created:** lazily, on demand. `mheap.grow()` maps in a new arena from the OS (via mmap) only when existing arenas lack enough free space to satisfy a request. This is also the granularity the scavenger operates within — it walks arenas looking for free page ranges to `madvise` back to the OS.

**Not to be confused with:** a user-facing "bump allocator" arena pattern from other languages — Go's `heapArena` is purely an internal runtime implementation detail, not something application code interacts with directly. (Trivia: Go experimented with an explicit user-facing `arena` package for manual memory management around Go 1.20, but removed it due to memory-safety concerns — misuse could cause use-after-free bugs, conflicting with Go's safety guarantees, so it never stabilized.)

## 7. Full Allocation Routing Schema (as diagrammed)

```javascript
allocation request (mallocgc)
        │
        ├── tiny (<16B, no pointers) → packed into shared 16B block
        │
        ├── small (16B–32KB) → rounds to a size class
        │         │
        │         → mcache (per-P, lock-free): pop a free slot from cached span
        │              │  (cache empty for this size class)
        │              → mcentral (per size class, shared, locked): hands a fresh span
        │                   │  (no free spans)
        │                   → mheap (global): carves span from a 64MB arena
        │
        └── large (>32KB) → straight to mheap, whole pages, bypasses mcache/mcentral

mheap requests more address space from the OS via mmap as arenas fill up.
The scavenger later returns unused pages to the OS from mheap via madvise.
```

## 8. Follow-ups to Have Ready

- *"Why does this per-P caching design remind you of something else we've discussed?"* → Structurally identical to sync.Pool's design — per-P local cache for the lock-free fast path, a shared tier (mcentral ↔ Pool's cross-P stealing) for the slower fallback, and a global tier (mheap ↔ OS/GC) at the top. Go reuses this sharding pattern across multiple subsystems as the standard answer to lock contention on hot paths in a multi-core runtime.
- *"Why 64MB specifically as the arena size?"* → Practical middle ground: large enough that the top-level lookup table stays small/cheap (fewer arenas to index for a given heap size), small enough that a process doesn't have to commit huge address space upfront — arenas are reserved lazily specifically to avoid over-committing.
