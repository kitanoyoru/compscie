---
date: 2026-08-23
---

# Go Memory Allocator

> Go's allocator follows the TCMalloc design: a lock-free fast path per P, a shared locked tier per span class, and a global heap that talks to the OS. Small objects are rounded up to a fixed size class and carved from spans. Pointer-free spans are kept apart from pointer-containing ones, so the GC can skip them. Checked against Go 1.26.

## Questions this answers

- Why is Go's allocator organized as `mcache`, `mcentral`, and `mheap`?
- What are size classes, and what do they cost and buy?
- Which allocation path does an object take: tiny, small, or large?
- Why are `scan` and `noscan` spans separate, and how does that help the GC?
- What is an arena, and how does the runtime find the span for an address?

## Notes

### Design basis

Go's allocator is based on **TCMalloc** (Google's Thread-Caching Malloc). A single global lock on every allocation would be a massive contention bottleneck, because Go programs allocate very often.

The fix is **per-P sharding**, the same principle as `sync.Pool`. The fast path is lock-free and scoped to the current P. More coordination and locking is added only as the request moves up the hierarchy.

### The three-tier hierarchy

- **`mcache`**: one per P, lock-free fast path. It holds one cached span per **span class**. A span class is a size class combined with the scan/noscan flag, so there are two per size class. Only the owning P touches its own `mcache`, so no lock is needed. This is the same principle as the per-P `private` slot in `sync.Pool`.
- **`mcentral`**: one per span class, shared across all Ps, protected by a lock. When a P's `mcache` runs out of free objects for a span class, it refills from the matching `mcentral`. Contention here is much rarer than per-allocation contention, because one refill supplies many later fast-path allocations.
- **`mheap`**: global. It manages the whole address space in **arenas** (64 MB chunks on most 64-bit platforms) and is what actually talks to the OS (`mmap` for more virtual memory). The **scavenger** also works from here: it returns free pages to the OS with `madvise`.

### Size classes

Go does not allocate arbitrary byte counts. It has a fixed table of about 70 size classes (68 entries in `sizeclasses.go`, including a special class 0): 8 B, 16 B, 24 B, 32 B, 48 B, and so on up to 32 KB. Every allocation request is **rounded up to the nearest size class**.

An `mspan` is a run of one or more 8 KB pages. It is divided into equal-size slots for exactly one size class, with a bitmap tracking which slots are used.

**Why fixed size classes instead of exact-size allocation?** It trades a little space for simplicity:

- Rounding up wastes a little memory per object (internal fragmentation). A 20-byte request rounds up to the 24-byte class.
- Every slot in a span has the same size, so allocation and free are cheap. There is no search for a fitting hole and no external fragmentation to manage.

### Three allocation paths

`mallocgc` routes each request to one of three paths:

1. **Tiny allocator** (objects under 16 bytes, no pointers): several small allocations are packed into a single 16-byte block per P. This amortizes per-object overhead for things like small strings or tiny structs, where slot overhead would otherwise dominate the data size.
2. **Small object path** (up to 32 KB): the normal `mcache` to `mcentral` to `mheap` fallback chain. Pointer-containing objects under 16 bytes also take this path.
3. **Large object path** (over 32 KB): goes directly to `mheap`, allocated in whole pages. It bypasses the per-P caches because large allocations are rare enough that the caching machinery would not pay for itself.

### Scan and noscan spans

The allocator keeps spans holding **pointer-free data** (`[]byte` backing arrays, plain numeric slices, string data) separate from spans holding objects with pointers. This is part of the span class.

The GC only needs to trace pointers. A **noscan span can be skipped entirely** during marking: the GC does not look inside it. For how marking works, see [Go Garbage Collector](garbage-collector.md#tri-color-marking).

**Production relevance:** a system that moves lots of raw byte buffers (serialized transaction data, hashes, and so on) gets a real reduction in GC scan work from this. The decision comes from the **type** of the allocation (whether it contains pointers), which the compiler passes to the allocator. It is separate from escape analysis, which decides stack versus heap ([Go Escape Analysis and GC Tuning](escape-analysis-gc-tuning.md#what-escape-analysis-decides)).

### Arenas

An arena is the unit in which `mheap` manages heap address space: large, fixed-size chunks, **64 MB each on most 64-bit platforms** (4 MB on 32-bit systems, where address space is more constrained). Instead of asking the OS for memory in small steps, Go maps address space one arena at a time. Spans and pages are carved out of arenas.

**What an arena records.** Internally, each arena is described by a `heapArena` struct. It holds metadata for every 8 KB page in that 64 MB range, including:

- a pointer to the `mspan` that currently owns each page, which gives a fast lookup from any address to span, size class, and object;
- per-page bitmaps for pages in use and pages marked by the GC.

Whether a span is `scan` or `noscan` is a property of the span's class, found through that span lookup.

**The lookup problem.** A 64-bit virtual address space is enormous, but real heap usage is sparse. One flat metadata array would be far too large. Go uses a **multi-level lookup structure**, conceptually like CPU page tables: the high bits of an address index into a sparse top-level table that points to the `heapArena` covering that address. "Which arena does this pointer belong to" becomes a small number of indexed lookups, however spread out the memory usage is.

**When arenas are created.** Lazily, on demand. `mheap.grow()` maps in a new arena from the OS (via `mmap`) only when existing arenas lack enough free space for a request. Unused pages inside the heap are later returned to the OS by the scavenger, which works from the free page ranges that `mheap` tracks.

### Allocation routing schema

```text
allocation request (mallocgc)
        │
        ├── tiny (<16B, no pointers) → packed into shared 16B block
        │
        ├── small (up to 32KB) → rounds to a size class
        │         │
        │         → mcache (per-P, lock-free): pop a free slot from cached span
        │              │  (cache empty for this span class)
        │              → mcentral (per span class, shared, locked): hands a fresh span
        │                   │  (no free spans)
        │                   → mheap (global): carves span from a 64MB arena
        │
        └── large (>32KB) → straight to mheap, whole pages, bypasses mcache/mcentral

mheap requests more address space from the OS via mmap as arenas fill up.
The scavenger later returns unused pages to the OS from mheap via madvise.
```

## Gotchas

### Heap arenas are not a user-facing arena allocator

Symptom: the word "arena" suggests a bump allocator that application code can use, as in other languages. Cause: Go's `heapArena` is purely an internal runtime detail, and application code does not interact with it.

Trivia: Go experimented with an explicit user-facing `arena` package for manual memory management around Go 1.20. It was put on hold and never stabilized, because misuse could cause use-after-free bugs, which conflicts with Go's safety guarantees.

## Interview drills

- _"Why does this per-P caching design remind you of something else we've discussed?"_ → It is structurally identical to `sync.Pool`: a per-P local cache for the lock-free fast path, a shared tier for the slower fallback (`mcentral` here, cross-P stealing in the Pool), and a global tier at the top (`mheap` here, the OS or GC for the Pool). Go reuses this sharding pattern as the standard answer to lock contention on hot paths. See [the three-tier hierarchy](#the-three-tier-hierarchy).
- _"Why 64 MB specifically as the arena size?"_ → A practical middle ground. It is large enough that the top-level lookup table stays small and cheap, and small enough that a process does not commit huge address space upfront. Arenas are reserved lazily to avoid over-committing. See [arenas](#arenas).
- _"Why does Go round allocations up to size classes?"_ → Slots in a span are identical, so allocation is a pop from a free list and there is no external fragmentation. The price is internal fragmentation. See [size classes](#size-classes).
- _"Why can the GC skip some memory entirely?"_ → Pointer-free objects live in `noscan` spans, which marking never looks inside. See [scan and noscan spans](#scan-and-noscan-spans).

## Sources

- [`runtime/malloc.go`](https://go.dev/src/runtime/malloc.go)
- [`runtime/mheap.go`](https://go.dev/src/runtime/mheap.go)
- [`runtime/sizeclasses.go`](https://go.dev/src/runtime/sizeclasses.go)
- [A Guide to the Go Garbage Collector](https://go.dev/doc/gc-guide)
