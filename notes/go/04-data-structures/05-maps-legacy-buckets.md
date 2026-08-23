# Go Maps — Legacy Bucket Design (Before Go 1.24)

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b1a407e452d81908cace39f5f293332)

> 🕰️ **Historical implementation.** This describes the classic bucket-based map used in Go versions **prior to 1.24**. Go 1.24 replaced it with a Swiss Table design — see the companion doc **Go Maps — Swiss Tables (Go 1.24+)**.
>
> **Why keep this page:** the growth/evacuation and thread-safety reasoning below is still the best illustration of Go's incremental-work philosophy, and interviewers who learned Go before 2025 will often be asking about *this* design. Knowing both, and knowing which is which, is the strongest position.
>
> `GOEXPERIMENT=noswissmap` was a transitional rollback option in Go 1.24/1.25. It is no longer present in Go 1.26, so this page should now be treated as historical architecture—not a selectable current implementation.

Notes from interview prep session. Companion to the Scheduler, Interfaces, Slices, and Channels pages.

## 1. The hmap Struct

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

`tophash` stores the top byte of each slot's hash, letting a lookup skip full key comparisons for slots that obviously don't match (single-byte comparison first). Values below `minTopHash` are reserved as **evacuation state markers** during growth, so the same byte does double duty.

**Why keys and values are stored in separate runs** (all 8 keys, then all 8 values) rather than interleaved as pairs: it avoids per-pair padding. A `map[int64]int8` interleaved would waste 7 bytes of alignment padding per entry; grouped, the padding is paid once per bucket.

## 2. Lookup Algorithm

1. Hash the key with the seeded hash function
2. Low `B` bits of the hash select which bucket
3. Top 8 bits get compared against that bucket's `tophash` array (cheap byte comparisons)
4. Only on a `tophash` match does it do a full key comparison
5. If the bucket's 8 slots are full and don't match, follow the overflow pointer to the chained bucket and repeat

## 3. Growth — Two Distinct Triggers

1. **Load factor exceeded** (\~6.5 entries/bucket average) → normal **doubling** growth: `B` increments by 1
2. **Too many overflow buckets relative to live entries** (sparse map from deletions, but still chained through many overflow buckets) → **same-size growth**: `B` stays the same, buckets reorganized to eliminate wasted overflow chains (defragmentation, not capacity increase)

## 4. Who Triggers Growth, and Who Migrates Data

| Phase | Who triggers it | When |
| --- | --- | --- |
| Decide to grow + allocate new bucket array | The goroutine doing the insert that crossed the threshold | Once, synchronously, inline in that single `mapassign` call |
| Evacuate old buckets into new layout | Whichever goroutine calls the *next* several writes/deletes | Spread across many subsequent operations, a couple buckets at a time |

`hashGrow()` itself does **not** move data — it just allocates the new array and sets `oldbuckets`. Actual copying (**evacuation**) happens lazily: every `mapassign`/`mapdelete` after growth starts evacuates one or two old buckets as a side effect before doing its own work. This amortizes the cost instead of causing one huge pause — same motivation as incremental stack growth/GC pacing.

**Perf implication:** map writes immediately after a growth is triggered have marginally higher, less predictable latency (since they may also evacuate a bucket). For latency-sensitive paths, preallocate with `make(map[K]V, expectedSize)` to avoid triggering growth during hot request paths.

## 5. Why Maps Aren't Thread-Safe

Deliberate design tradeoff — locking would cost every single-threaded map user. Instead: cheap, best-effort detection via `hmap.flags`' `hashWriting` bit. Before a write, the runtime sets this bit; if already set (another write in progress), it crashes immediately:

```text
fatal error: concurrent map writes
```

A concurrent read during a write similarly produces:

```text
fatal error: concurrent map read and map write
```

Both are **fatal errors**, not recoverable panics — Go treats unsynchronized concurrent map access as a programming bug. Standard fixes: a plain map protected by `sync.Mutex` or `sync.RWMutex` (choose from measured contention/read patterns), or `sync.Map` for its documented specialized workloads. The old read-only/dirty-map explanation is historical since Go 1.24.

## 6. Iteration Order Randomization

Deliberate and enforced: every `range` over a map picks a **random starting bucket and random starting slot** within it — independent of `hash0`. This stops programs from accidentally depending on iteration order (never guaranteed, could change between versions/runs).

**For deterministic output:** extract keys into a slice, sort it, then iterate the sorted keys — standard idiom for stable map output (deterministic JSON serialization, reproducible logs). Note `encoding/json` already sorts map keys when marshaling, so JSON output is stable without you doing anything.

**Separately, `hash0` exists for security, not order.** The per-map random seed makes it infeasible for an attacker to craft keys that all collide into one bucket, which would degrade lookups from O(1) to O(n) — a classic hash-flooding DoS against anything that puts user-controlled strings into a map (HTTP headers, query params, JSON fields). Two different concerns, often conflated: `hash0` = collision resistance, iteration randomization = preventing order dependence.

## 7. Semantics That Are Not Implementation Details

These hold across both the legacy and Swiss implementations — they are language guarantees, so they're safe answers regardless of version:

- **Map elements are not addressable.** `&m[k]` doesn't compile, and `m[k].Field = v` doesn't compile for struct values. Reason: growth relocates entries, so any pointer taken would dangle. Workarounds: `map[K]*V`, or read-modify-write the whole value.
- **Reading a missing key returns the zero value**, no panic. `v, ok := m[k]` distinguishes "absent" from "present but zero."
- **Deleting during iteration is legal.** Entries deleted before being reached will not be produced. Entries *added* during iteration may or may not be produced — genuinely unspecified.
- **`clear(m)`** (Go 1.21+) removes all entries while retaining allocated capacity — the right way to recycle a map, versus `m = make(...)` which discards it. Note it also correctly handles `NaN` keys, which the old delete-in-a-loop idiom could not remove.
- **Maps never shrink.** A map that grew to 1M entries and then had them all deleted retains the bucket array. If that matters, replace the map rather than clearing it.
- **`len(m)`** is O(1) — it's the `count` field.

## 8. `sync.Map` — When and Why

`sync.Map` is not "a faster map" — it is a map for two specific access patterns, and it is **slower** than `RWMutex` + plain map for general workloads:

1. Write-once, read-many (a cache populated at startup)
2. Disjoint key sets per goroutine (each goroutine touches its own keys)

The classic implementation used a read-only `read` map plus a `dirty` map: reads hit `read` with an atomic load and no lock at all; misses fall through to `dirty` under a mutex, and enough misses promote `dirty` to `read`. The cost is roughly doubled memory and expensive first-writes.

**Go 1.24 replaced the internals** with a **HashTrieMap** — a concurrent hash-trie — which improves the previously poor write and delete performance and makes `sync.Map` far less pathological outside its two ideal patterns. The API is unchanged. If your knowledge of `sync.Map` is "read map + dirty map," that's now the *historical* answer.

Also worth knowing: `sync.Map` is untyped (`any` keys and values), so it reintroduces boxing and type assertions. For most services, a `Mutex`/`RWMutex` around a `map[K]V`, or **sharded maps** (N maps each with their own mutex, keyed by `hash(k) % N`) to cut contention, is the better default.

## 9. Follow-ups to Have Ready

- *"Does growth cause unpredictable write latency?"* → Yes, slightly — a write that also evacuates a bucket does marginally more work. Real (if small) source of tail latency variance in high-throughput services.
- *"How would you get deterministic map output?"* → Sort extracted keys before iterating.

## Official Sources

- [Go 1.24 release notes: Swiss-map transition](https://go.dev/doc/go1.24)
- [Faster Go maps with Swiss Tables](https://go.dev/blog/swisstable)
- [Go 1.23.12 legacy `runtime/map.go`](https://cs.opensource.google/go/go/+/refs/tags/go1.23.12:src/runtime/map.go)
