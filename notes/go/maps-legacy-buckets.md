---
date: 2026-08-23
---

# Go Maps: Legacy Buckets (before Go 1.24)

> The classic map is an array of 2^B buckets, each holding up to 8 key/value pairs with a `tophash` byte per slot and an overflow chain when a bucket fills. Growth allocates a new array and migrates old buckets lazily, a couple per write. This is a historical implementation: Go 1.24 replaced it with Swiss tables, covered in [Go Maps: Swiss Tables (Go 1.24+)](maps-swiss-tables.md). Checked against Go 1.26.

## Questions this answers

- How was the bucket-based map laid out, and how did lookup work?
- What triggered growth, and who did the migration work?
- Why was growth spread across later writes?
- How did the runtime detect concurrent map access in this design?
- What did `sync.Map` look like before Go 1.24?

## Notes

### Why this page still matters

The growth and evacuation logic and the thread-safety reasoning below are still the best illustration of Go's incremental-work philosophy. Interviewers who learned Go before 2025 will often be asking about _this_ design. Knowing both, and knowing which is which, is the strongest position.

`GOEXPERIMENT=noswissmap` was a transitional rollback option in Go 1.24 and 1.25. It is no longer present in Go 1.26, so treat this page as historical architecture, not a selectable current implementation.

### The `hmap` struct

```go
type hmap struct {
    count      int            // number of live key/value pairs
    flags      uint8
    B          uint8          // log2(number of buckets) — 2^B buckets
    noverflow  uint16         // approx count of overflow buckets in use
    hash0      uint32         // hash seed, randomized per-map at creation
    buckets    unsafe.Pointer // array of 2^B buckets
    oldbuckets unsafe.Pointer // non-nil during growth — the previous, smaller bucket array
    nevacuate  uintptr        // progress marker for incremental growth
    extra      *mapextra
}
```

Each bucket (`bmap`) holds up to **8 key/value pairs**:

```go
type bmap struct {
    tophash [8]uint8
    // followed in memory by: 8 keys, then 8 values, then an overflow bucket pointer
}
```

`tophash` stores the top byte of each slot's hash. This lets a lookup skip full key comparisons for slots that obviously do not match, using a single-byte comparison first. Values below `minTopHash` are reserved as **evacuation state markers** during growth, so the same byte does double duty.

**Why keys and values are stored in separate runs** (all 8 keys, then all 8 values) rather than interleaved as pairs: it avoids per-pair padding. A `map[int64]int8` interleaved would waste 7 bytes of alignment padding per entry, while grouped, the padding is paid once per bucket.

### Lookup algorithm

1. Hash the key with the seeded hash function.
2. The low `B` bits of the hash select which bucket.
3. The top 8 bits are compared against that bucket's `tophash` array (cheap byte comparisons).
4. Only on a `tophash` match does it do a full key comparison.
5. If the bucket's 8 slots are full and none match, follow the overflow pointer to the chained bucket and repeat.

### Growth triggers

There are two distinct triggers:

1. **Load factor exceeded** (about 6.5 entries per bucket on average) leads to normal **doubling** growth: `B` increments by 1.
2. **Too many overflow buckets relative to live entries** (a sparse map from deletions that is still chained through many overflow buckets) leads to **same-size growth**: `B` stays the same, and buckets are reorganized to eliminate wasted overflow chains. This is defragmentation, not a capacity increase.

### Who triggers growth and who migrates data

| Phase                                      | Who triggers it                                             | When                                                                 |
| ------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| Decide to grow + allocate new bucket array | The goroutine doing the insert that crossed the threshold   | Once, synchronously, inline in that single `mapassign` call          |
| Evacuate old buckets into new layout       | Whichever goroutine calls the _next_ several writes/deletes | Spread across many subsequent operations, a couple buckets at a time |

`hashGrow()` itself does **not** move data. It just allocates the new array and sets `oldbuckets`. The actual copying (**evacuation**) happens lazily: every `mapassign` or `mapdelete` after growth starts evacuates one or two old buckets as a side effect before doing its own work. This amortizes the cost instead of causing one huge pause, with the same motivation as incremental stack growth and GC pacing.

### Iteration order and hash seed

Every `range` over a map picks a **random starting bucket and random starting slot** within it, independent of `hash0`. The full explanation of randomized iteration, deterministic output, and why the seed exists is in [Go Maps: Swiss Tables](maps-swiss-tables.md#what-did-not-change). The two are separate concerns: `hash0` provides collision resistance against hash flooding, and iteration randomization prevents order dependence.

### Why maps are not thread-safe

In this design, the runtime detects concurrent access with the `hashWriting` bit in `hmap.flags`. Before a write, the runtime sets this bit. If it is already set (another write in progress), the runtime crashes immediately with `fatal error: concurrent map writes`. A concurrent read during a write similarly produces `fatal error: concurrent map read and map write`.

The reasoning, the fixes, and the Swiss-era behavior are in [`fatal error: concurrent map writes`](maps-swiss-tables.md#fatal-error-concurrent-map-writes). The behavior is identical across both implementations.

### `sync.Map` before Go 1.24

The classic implementation used a read-only `read` map plus a `dirty` map. Reads hit `read` with an atomic load and no lock at all. Misses fall through to `dirty` under a mutex, and enough misses promote `dirty` to `read`. The cost was roughly doubled memory and expensive first writes.

Go 1.24 replaced these internals with a HashTrieMap. When to use `sync.Map` at all is covered in [`sync.Map` is not a faster map](maps-swiss-tables.md#syncmap-is-not-a-faster-map).

### Semantics that did not change

Addressability, zero values for missing keys, deletion during iteration, `clear(m)`, maps never shrinking, and O(1) `len(m)` are the same in both implementations. They are described in full in [Go Maps: Swiss Tables](maps-swiss-tables.md#what-did-not-change). In this design, a map that grew large and was then emptied kept its full bucket array.

## Gotchas

### Write latency after growth

Map writes immediately after a growth is triggered have marginally higher, less predictable latency, because they may also evacuate a bucket. For latency-sensitive paths, preallocate with `make(map[K]V, expectedSize)` to avoid triggering growth during hot request paths. Swiss maps bound this cost per table, as described in [extendible hashing](maps-swiss-tables.md#extendible-hashing).

## Interview drills

- _"Does growth cause unpredictable write latency?"_ → Yes, slightly. A write that also evacuates a bucket does marginally more work. This is a real, if small, source of tail latency variance in high-throughput services. See [write latency after growth](#write-latency-after-growth).
- _"How would you get deterministic map output?"_ → Sort the extracted keys before iterating. See [Go Maps: Swiss Tables](maps-swiss-tables.md#what-did-not-change).
- _"Who does the evacuation work?"_ → the later writes and deletes, one or two buckets each. See [who triggers growth and who migrates data](#who-triggers-growth-and-who-migrates-data).
- _"What were the two growth triggers?"_ → load factor (doubling) and too many overflow buckets (same-size growth). See [growth triggers](#growth-triggers).

## Sources

- [Go 1.24 release notes: Swiss-map transition](https://go.dev/doc/go1.24)
- [Faster Go maps with Swiss Tables](https://go.dev/blog/swisstable)
- [Go 1.23.12 legacy `runtime/map.go`](https://cs.opensource.google/go/go/+/refs/tags/go1.23.12:src/runtime/map.go)
