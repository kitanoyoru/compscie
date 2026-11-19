---
date: 2026-08-23
---

# Go Maps: Swiss Tables (Go 1.24+)

> The current map implementation, shipped in Go 1.24 (Feb 2025), stores entries in groups of 8 slots with a control word that is matched in parallel. Large maps are a directory of bounded tables that split independently, so growth never rehashes the whole map. The user-visible semantics did not change. For the bucket-and-overflow design this replaced, see [Go Maps: Legacy Buckets (before Go 1.24)](maps-legacy-buckets.md). Checked against Go 1.24 to 1.26.

## Questions this answers

- How are Go maps implemented today, and what changed in Go 1.24?
- Why is the control word fast, and why are false positives fine?
- What happens when a large map grows?
- Why do deletes leave tombstones?
- Which map semantics are the same as before, and which advice still holds?
- What does `fatal error: concurrent map writes` mean, and what is the fix?
- When is `sync.Map` the right choice?

## Notes

### Why it changed

The legacy design had three structural costs:

- **Overflow chains.** A full bucket chains to an overflow bucket, so a bad key distribution turns lookups into pointer-chasing across scattered allocations. Every hop is a probable cache miss.
- **Byte-at-a-time probing.** Scanning the 8 `tophash` entries meant up to 8 comparisons with 8 unpredictable branches.
- **Global doubling.** Growth doubled the whole bucket array. Even with lazy evacuation spreading the copy cost, a very large map still paid a large allocation and a long tail of evacuation work.

Swiss Tables (from Google's Abseil C++ library) address all three. The Go 1.24 release notes credit Swiss maps, faster small-object allocation, and a new runtime mutex together for a **2 to 3% average CPU reduction** across representative benchmarks. Map-specific gains vary widely by key type and access pattern, so quoting one number for maps alone is a mistake.

### Group and control word

The unit is a **group of 8 slots**, and each group carries an 8-byte **control word** with one control byte per slot.

Each control byte holds one of:

| Value                 | Meaning                                                |
| --------------------- | ------------------------------------------------------ |
| `0x80` (high bit set) | **Empty**: never used                                  |
| `0xFE`                | **Deleted**: tombstone; probing must continue past it  |
| `0x00`–`0x7F`         | **Full**: holds `h2`, the low 7 bits of the key's hash |

The hash is split. **`h1`** (the upper bits) selects which group to probe, and **`h2`** (7 bits) goes in the control byte as a cheap fingerprint.

### Lookup by parallel control-byte matching

This is the heart of the design, and the thing to be able to explain:

1. Hash the key. Use `h1` to pick a starting group.
2. Load the group's entire 8-byte control word as a **single `uint64`**.
3. Broadcast `h2` across all 8 bytes and XOR. Matching bytes become zero.
4. Use a bit trick to produce a bitmask of which of the 8 bytes were zero.
5. Iterate only the set bits, doing a full key comparison for each candidate.
6. If there is no match and the group has an empty slot, the key is absent, so stop. Otherwise probe the next group (quadratic probing).

Steps 2 to 4 test all 8 control bytes in parallel. Portable builds use word-at-a-time bit tricks (SWAR). On amd64, current Go compilers replace the matching helpers with architecture-specific intrinsics that use packed/SIMD instructions. This is an internal optimization, not a language guarantee, and the full key comparison remains authoritative.

**Why false positives are fine:** `h2` is only 7 bits, so unrelated keys collide on it roughly 1 in 128 times. A match on the control byte is just a _hint_ to do the real key comparison. It filters cheaply and does not decide.

### Extendible hashing

This is the second major change, and the one with the clearest production impact.

A large map is not one flat array. It is a **directory** of pointers to **tables**:

- Directory size is `1 << globalDepth`.
- Each table has its own `localDepth` and a bounded **slot capacity**. `maxTableCapacity` is **1024 slots**, not 1024 live entries. At the 7/8 average load limit that is about 896 live entries before growth or splitting.
- A table below that limit first grows by doubling its own capacity. Once a table is at the limit and fills, it **splits into two** tables and increments its `localDepth`. Entries are redistributed by the next bit of their hash, and the directory is updated to point at the two new tables. If `localDepth` would exceed `globalDepth`, the directory itself doubles first. The directory is just pointers, so that is cheap.

**The consequence:** growth work is bounded to one table of at most 1024 slots at a time, no matter how large the map is. The legacy design's cost scaled with total map size, and this does not. For latency-sensitive services this is the real headline, because it removes a source of tail-latency spikes on maps that grow during request handling.

**Small maps skip all of this.** A map with at most 8 entries uses a **single group** with no directory. It is not necessarily one cache line: group size depends on the key and value types, and indirect storage may be used for large types. Since most maps in real programs are small, this is a significant practical win.

### Load factor and tombstones

- Maximum average load is **7/8 across a table**, not per group. An individual group may be completely full. The table as a whole must retain enough empty slots that probing can eventually reach an empty group and terminate.
- Deletion normally writes a **tombstone** (`0xFE`) rather than clearing the slot, because clearing could truncate a probe sequence that runs through it and orphan later entries.
- Optimization: if the deleted entry's group still has an empty slot, no probe sequence can run past it, so the slot can be marked genuinely empty instead of tombstoned.

**Delete-heavy workloads can accumulate tombstones**, which lengthen probes. Inserts reuse the first tombstone encountered, and the current runtime can run `pruneTombstones` to turn tombstones that are no longer needed for probe continuity back into empty slots. Growth and rehash also clear remaining tombstones. Rebuild the map only after profiling demonstrates a real issue.

### Collision resolution step by step

Go resolves collisions with open addressing, not overflow chains:

1. `h1` chooses the first group, and `h2` identifies candidate slots inside it.
2. Every matching `h2` bit triggers a full key equality check. An `h2` collision alone is harmless.
3. If none match and the group contains an empty slot, lookup stops: the key was never inserted later in this probe sequence.
4. If the group has no empty slot, probing advances quadratically through groups. Offsets follow triangular numbers (`0, 1, 3, 6, 10, ...`) modulo the table's group count.
5. A tombstone does **not** terminate lookup. It preserves the path to keys placed later by earlier collisions.

This is the essential contrast with the legacy map: old maps followed linked overflow buckets, while Swiss maps probe compact groups and filter candidates with control bytes.

### What did not change

Most of these are language guarantees. The hash seed, never shrinking, and the O(1) `len` are runtime behavior that survived the rewrite rather than spec guarantees. Either way, every piece of _user-visible_ map advice from the legacy design carries over unchanged. Only the performance characteristics moved.

- **Iteration order is randomized per `range`.** The spec leaves the order unspecified, and the runtime randomizes it on purpose so programs cannot accidentally depend on it. For deterministic output, extract the keys into a slice, sort it, and iterate the sorted keys. This is the standard idiom for stable map output (deterministic serialization, reproducible logs). `encoding/json` already sorts map keys when marshaling, so JSON output is stable without any work from you.
- **The per-map hash seed is still randomized, for security rather than ordering.** The seed makes it infeasible for an attacker to craft keys that all collide, which would degrade lookups from O(1) toward O(n). This is a classic hash-flooding DoS against anything that puts user-controlled strings into a map (HTTP headers, query params, JSON fields). The two concerns are often conflated: the seed provides collision resistance, and iteration randomization prevents order dependence.
- **Still not thread-safe.** See [`fatal error: concurrent map writes`](#fatal-error-concurrent-map-writes).
- **Map elements are not addressable.** `&m[k]` does not compile, and `m[k].Field = v` does not compile for struct values. The reason is that growth relocates entries, so any pointer taken would dangle. Workarounds: use `map[K]*V`, or read-modify-write the whole value.
- **Reading a missing key returns the zero value**, with no panic. `v, ok := m[k]` distinguishes "absent" from "present but zero".
- **Deleting during iteration is legal.** Entries deleted before being reached will not be produced. Entries _added_ during iteration may or may not be produced, which is genuinely unspecified.
- **`clear(m)`** (Go 1.21+) removes all entries while retaining allocated capacity. It is the right way to recycle a map, versus `m = make(...)`, which discards it. It also correctly handles `NaN` keys, which the old delete-in-a-loop idiom could not remove.
- **Maps never shrink** on their own. A map that grew to 1M entries and then had them all deleted keeps its allocated capacity. If that matters, replace the map rather than clearing it.
- **`len(m)` is still O(1)**, because the map tracks its entry count.

### War story: an RSS increase

When Datadog upgraded to Go 1.24 they saw a **~20% RSS increase** across services and initially suspected Swiss maps. They tested `GOEXPERIMENT=noswissmap` and saw no improvement. They also tested `GOEXPERIMENT=nospinbitmutex`, again with no improvement. The Go runtime's own memory metrics showed nothing wrong, while system RSS clearly rose.

The actual cause, found by bisecting, was an unrelated refactor of `mallocgc`, which changed how previously reserved but uncommitted virtual memory got committed to physical RAM.

**Two takeaways that make this a good interview anecdote:**

1. The headline feature of a release is a tempting culprit and often the wrong one. `GOEXPERIMENT` flags are excellent for cheaply falsifying that hypothesis.
2. Go runtime metrics track the runtime's _own_ accounting, while RSS is what the kernel actually committed. A gap between them is a real signal, not a measurement error, and it is exactly the gap that gets pods OOM-killed. Compare the scavenger's `MADV_DONTNEED` vs `MADV_FREE` history in [Go Scheduler (GMP)](scheduler-gmp.md), which is the same class of problem.

### Version boundary and experiments

`GOEXPERIMENT=noswissmap` was a transitional escape hatch in Go 1.24 and 1.25. It is not present in the Go 1.26 experiment list, so do not depend on it for production rollback. Likewise, `mapsplitgroup` is not a released Go 1.26 experiment flag.

Go 1.26's experimental `simd/archsimd` package is a separate public-API experiment. Swiss-map matching already uses compiler intrinsics on supported amd64 targets, so do not infer the map implementation from the existence of the package.

## Gotchas

### `fatal error: concurrent map writes`

**Symptom:** the process dies with one of these:

```text
fatal error: concurrent map writes
```

```text
fatal error: concurrent map read and map write
```

**Cause:** maps are deliberately not thread-safe, because locking would cost every single-threaded map user. Instead the runtime does cheap, best-effort detection. Before a write it sets a writing flag on the map. If the flag is already set (another write in progress), or a read sees it set, the runtime crashes immediately. Both messages are **fatal errors**, not recoverable panics, so `recover` cannot catch them. Go treats unsynchronized concurrent map access as a programming bug. The detection is best-effort, so its absence does not prove the code is safe. The legacy design used the `hashWriting` bit for this, described in [Go Maps: Legacy Buckets](maps-legacy-buckets.md#why-maps-are-not-thread-safe).

**Fix:** protect a plain map with `sync.Mutex` or `sync.RWMutex`, choosing from measured contention and read patterns. Or use `sync.Map` for its documented specialized workloads (see below). For heavy contention, shard the map: N maps, each with its own mutex, keyed by `hash(k) % N`.

### `sync.Map` is not a faster map

`sync.Map` is a map for two specific access patterns, and it is **slower** than `RWMutex` plus a plain map for general workloads:

1. Write-once, read-many (a cache populated at startup).
2. Disjoint key sets per goroutine (each goroutine touches its own keys).

**Go 1.24 replaced the internals** with a **HashTrieMap**, a concurrent hash-trie. This improves the previously poor write and delete performance and makes `sync.Map` far less pathological outside its two ideal patterns. The API is unchanged. If your knowledge of `sync.Map` is "read map plus dirty map", that is now the _historical_ answer, covered in [Go Maps: Legacy Buckets](maps-legacy-buckets.md#syncmap-before-go-124).

`sync.Map` is also untyped (`any` keys and values), so it reintroduces boxing and type assertions. For most services, a `Mutex` or `RWMutex` around a `map[K]V`, or the sharded maps described above, is the better default.

## Interview drills

- _"How are Go maps implemented?"_ → Lead with Swiss Tables and **date it** ("since 1.24; before that, buckets with overflow chains"). Naming the version boundary is what signals current knowledge. See [why it changed](#why-it-changed).
- _"Why is the control word fast?"_ → 8 fingerprints matched in parallel, using portable SWAR and amd64 compiler intrinsics. See [lookup by parallel control-byte matching](#lookup-by-parallel-control-byte-matching).
- _"What happens when a map grows?"_ → a table split bounded at 1024 slots (about 896 live entries at 7/8 load) and no global rehash, in contrast with legacy doubling plus lazy evacuation. See [extendible hashing](#extendible-hashing).
- _"Did anything change for me as a user?"_ → nothing semantically, only performance. See [what did not change](#what-did-not-change).
- _"Why tombstones?"_ → probe-sequence integrity. See [load factor and tombstones](#load-factor-and-tombstones).
- _"How would you get deterministic map output?"_ → sort the extracted keys before iterating. See [what did not change](#what-did-not-change).
- _"Do concurrent map reads and writes panic?"_ → they crash with an unrecoverable fatal error. See [`fatal error: concurrent map writes`](#fatal-error-concurrent-map-writes).

## Sources

- [Faster Go maps with Swiss Tables](https://go.dev/blog/swisstable)
- [`internal/runtime/maps` source](https://go.dev/src/internal/runtime/maps/)
- [Go 1.24 release notes](https://go.dev/doc/go1.24)
- [Go 1.26 release notes](https://go.dev/doc/go1.26)
- [Go language specification: map types](https://go.dev/ref/spec#Map_types)
- [`sync.Map`](https://pkg.go.dev/sync#Map)
