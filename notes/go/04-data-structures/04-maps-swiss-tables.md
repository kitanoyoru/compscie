# Go Maps — Swiss Tables (Go 1.24+)

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b1a407e452d81848c62ec9511ede68d)

The current map implementation, shipped in **Go 1.24** (Feb 2025). Companion to **Go Maps Internals (Legacy Implementation — Before Go 1.24)**, which covers the bucket-and-overflow design this replaced.

> 🆕 This page was missing — the legacy maps doc referenced it as a companion but it had never been written. Content verified against Go 1.24–1.26.

## 1. Why It Changed

The legacy design had three structural costs:

- **Overflow chains.** A full bucket chains to an overflow bucket, so a bad key distribution turns lookups into pointer-chasing across scattered allocations. Every hop is a probable cache miss.
- **Byte-at-a-time probing.** Scanning the 8 `tophash` entries meant up to 8 comparisons with 8 unpredictable branches.
- **Global doubling.** Growth doubled the whole bucket array. Even with lazy evacuation spreading the copy cost, a very large map still paid a large allocation and a long tail of evacuation work.

Swiss Tables (from Google's Abseil C++ library) address all three. Go 1.24's release notes credit Swiss maps, faster small-object allocation, and a new runtime mutex together for a **2–3% average CPU reduction** across representative benchmarks — map-specific gains vary widely by key type and access pattern, so quoting one number for maps alone is a mistake.

## 2. Group and Control Word

The unit is a **group of 8 slots**, and each group carries an 8-byte **control word**: one control byte per slot.

Each control byte holds one of:

| Value                 | Meaning                                                 |
| --------------------- | ------------------------------------------------------- |
| `0x80` (high bit set) | **Empty** — never used                                  |
| `0xFE`                | **Deleted** — tombstone; probing must continue past it  |
| `0x00`–`0x7F`         | **Full** — holds `h2`, the low 7 bits of the key's hash |

The hash is split: **`h1`** (the upper bits) selects which group to probe, **`h2`** (7 bits) goes in the control byte as a cheap fingerprint.

## 3. Lookup — Parallel Control-Byte Matching

This is the heart of the design, and the thing to be able to explain:

1. Hash the key. Use `h1` to pick a starting group.
2. Load the group's entire 8-byte control word as a **single `uint64`**.
3. Broadcast `h2` across all 8 bytes and XOR — matching bytes become zero.
4. Use a bit trick to produce a bitmask of which of the 8 bytes were zero.
5. Iterate only the set bits, doing a full key comparison for each candidate.
6. If no match and the group has an empty slot → key is absent, stop. Otherwise probe the next group (quadratic probing).

Steps 2–4 test all 8 control bytes in parallel. Portable builds use word-at-a-time bit tricks (SWAR). On amd64, current Go compilers replace the matching helpers with architecture-specific intrinsics that use packed/SIMD instructions. This is an internal optimization, not a language guarantee; the full key comparison remains authoritative.

**Why false positives are fine:** `h2` is only 7 bits, so unrelated keys collide on it roughly 1 in 128 times. A match on the control byte is just a _hint_ to do the real key comparison. It filters cheaply; it doesn't decide.

## 4. Extendible Hashing — Growth Without Global Rehash

The second major change, and the one with the clearest production impact.

A large map is not one flat array. It's a **directory** of pointers to **tables**:

- Directory size is `1 << globalDepth`.
- Each table has its own `localDepth` and a bounded **slot capacity** — `maxTableCapacity` is **1024 slots**, not 1024 live entries. At the 7/8 average load limit that is about 896 live entries before growth or splitting.
- When a table fills, it **splits into two** tables, incrementing its `localDepth`, and entries are redistributed by the next bit of their hash. The directory is updated to point at the two new tables. If `localDepth` would exceed `globalDepth`, the directory itself doubles first — but the directory is just pointers, so that's cheap.

**The consequence:** growth work is bounded to one 1024-entry table at a time, no matter how large the map is. The legacy design's cost scaled with total map size; this doesn't. For latency-sensitive services this is the real headline — it removes a source of tail-latency spikes on maps that grow during request handling.

**Small maps skip all of this.** A map with at most 8 entries uses a **single group** with no directory. It is not necessarily one cache line: group size depends on the key and value types, and indirect storage may be used for large types. Since most maps in real programs are small, this is a significant practical win.

## 5. Load Factor and Tombstones

- Maximum average load is **7/8 across a table**, not per group. An individual group may be completely full. The table as a whole must retain enough empty slots that probing can eventually reach an empty group and terminate.
- Deletion normally writes a **tombstone** (`0xFE`) rather than clearing the slot, since clearing could truncate a probe sequence that runs through it and orphan later entries.
- Optimization: if the deleted entry's group still has an empty slot, no probe sequence can run past it, so the slot can be marked genuinely empty instead of tombstoned.

**Delete-heavy workloads can accumulate tombstones**, which lengthen probes. Inserts reuse the first tombstone encountered, and the current runtime can run `pruneTombstones` to turn tombstones that are no longer needed for probe continuity back into empty slots. Growth/rehash also clears remaining tombstones. Rebuild only after profiling demonstrates a real issue.

### Collision resolution, step by step

Go resolves collisions with open addressing, not overflow chains:

1. `h1` chooses the first group; `h2` identifies candidate slots inside it.
2. Every matching `h2` bit triggers a full key equality check. An `h2` collision alone is harmless.
3. If none match and the group contains an empty slot, lookup stops: the key was never inserted later in this probe sequence.
4. If the group has no empty slot, probing advances quadratically through groups: offsets follow triangular numbers (`0, 1, 3, 6, 10, ...`) modulo the table's group count.
5. A tombstone does **not** terminate lookup; it preserves the path to keys placed later by earlier collisions.

This is the essential contrast with the legacy map: old maps followed linked overflow buckets; Swiss maps probe compact groups and filter candidates with control bytes.

## 6. What Did _Not_ Change

All of these are language-level guarantees and behave identically:

- **Iteration order is still randomized** per `range`.
- **Still not thread-safe.** `fatal error: concurrent map writes` and `concurrent map read and map write` still fire, still as unrecoverable fatal errors.
- **Per-map hash seed** still randomized, still for hash-flooding DoS resistance.
- **Elements still not addressable**; `&m[k]` still doesn't compile.
- **Maps still never shrink** on their own.
- `len()` still O(1).

So every piece of _user-visible_ map advice from the legacy notes carries over unchanged. Only the performance characteristics moved.

## 7. War Story Worth Knowing

When Datadog upgraded to Go 1.24 they saw a **\~20% RSS increase** across services and initially suspected Swiss maps. They tested `GOEXPERIMENT=noswissmap` — no improvement. Also tested `GOEXPERIMENT=nospinbitmutex` — no improvement. The Go runtime's own memory metrics showed nothing wrong, while system RSS clearly rose.

The actual cause, found by bisecting, was an unrelated refactor of `mallocgc`, which changed how previously-reserved-but-uncommitted virtual memory got committed to physical RAM.

**Two takeaways that make this a good interview anecdote:**

1. The headline feature of a release is a tempting culprit and often the wrong one. `GOEXPERIMENT` flags are excellent for cheaply falsifying that hypothesis.
2. Go runtime metrics track the runtime's _own_ accounting; RSS is what the kernel actually committed. A gap between them is a real signal, not a measurement error — and it's exactly the gap that gets pods OOM-killed. (Compare the scavenger's `MADV_DONTNEED` vs `MADV_FREE` history in the Scheduler notes §11 — same class of problem.)

## 8. Version Boundary and Experiments

`GOEXPERIMENT=noswissmap` was a transitional escape hatch in Go 1.24/1.25. It is not present in the Go 1.26 experiment list, so do not depend on it for production rollback. Likewise, `mapsplitgroup` is not a released Go 1.26 experiment flag.

Go 1.26's experimental `simd/archsimd` package is a separate public-API experiment. Swiss-map matching already uses compiler intrinsics on supported amd64 targets; do not infer the map implementation from the existence of the package.

## 9. Interview Drills

- _"How are Go maps implemented?"_ → Lead with Swiss Tables and **date it** ("since 1.24; before that, buckets with overflow chains"). Naming the version boundary is what signals current knowledge.
- _"Why is the control word fast?"_ → §3, 8 fingerprints matched in parallel; portable SWAR and amd64 compiler intrinsics
- _"What happens when a map grows?"_ → §4, table split bounded at 1024 slots (about 896 live entries at 7/8 load), no global rehash — contrast with legacy doubling + lazy evacuation
- _"Did anything change for me as a user?"_ → §6, nothing semantically; only performance
- _"Why tombstones?"_ → §5, probe-sequence integrity

## Official Sources

- [Faster Go maps with Swiss Tables](https://go.dev/blog/swisstable)
- [`internal/runtime/maps` source](https://go.dev/src/internal/runtime/maps/)
- [Go 1.24 release notes](https://go.dev/doc/go1.24)
- [Go 1.26 release notes](https://go.dev/doc/go1.26)
