---
date: 2026-08-23
concepts: Memory, Production diagnostics
---

# Go Garbage Collector

> Go's GC is a concurrent, tri-color, non-generational, non-compacting mark-and-sweep collector. A hybrid write barrier lets marking run alongside the program without re-scanning stacks, so the stop-the-world pauses stay very short. The price is some throughput, in exchange for predictable latency. Checked against Go 1.26.

## Questions this answers

- What kind of collector is Go's, and what does tri-color marking do?
- Why is a write barrier needed, and what does the hybrid barrier shade?
- What are the phases of a GC cycle, and which ones stop the world?
- What is mutator assist, and why does it show up as latency?
- Why is Go's GC not generational or compacting?
- What counts as a GC root?

## Notes

### What kind of collector Go uses

Go's GC is a **concurrent, tri-color, mark-and-sweep collector**:

- **Concurrent**: it runs alongside normal goroutines instead of stopping the world for the whole cycle. The headline feature is sub-millisecond stop-the-world (STW) pauses.
- **Tri-color**: the core marking algorithm (see below).
- **Non-generational and non-compacting**: unlike Java's collectors, there is no young/old split, and heap objects are never moved to defragment. This is a deliberate tradeoff, not an oversight (see [why non-generational and non-compacting](#why-non-generational-and-non-compacting)).

Go 1.26 makes the Green Tea implementation the default. It reorganizes marking for better locality but keeps this same model. See [Green Tea GC in Go 1.26](escape-analysis-gc-tuning.md#green-tea-gc-in-go-126).

### Tri-color marking

Every object is conceptually one of three colors during a cycle:

- **White**: not yet visited. Anything still white at the end of the cycle is garbage.
- **Grey**: visited, but its own outgoing pointers have not been scanned yet.
- **Black**: visited, and all its outgoing pointers are scanned. It is fully processed and definitely live.

**Algorithm:** mark every root (goroutine stacks, globals) grey. Repeatedly pick a grey object, mark each white pointer target it holds as grey, then turn that object black. Continue until no grey objects remain. Whatever is still white is provably unreachable and safe to reclaim.

### The write barrier

**The hazard:** mutator goroutines keep running and changing the pointer graph while marking happens. Suppose a black (already "done") object gets a new pointer to a white object, and at the same time the last grey reference to that white object is removed elsewhere. The GC never revisits the black object, so the white object is collected while still reachable. The result is a live pointer to freed memory.

**The fix is the hybrid write barrier** (since Go 1.8): compiler-inserted code around every pointer write during concurrent mark.

```text
writePointer(slot, newPtr):
    shade(*slot)     // shade the OLD value being overwritten
    shade(newPtr)    // shade the NEW value being written
    *slot = newPtr
```

Shading both the old and the new value closes the hazard from both directions.

**Key engineering win:** this works **without** re-scanning any goroutine's stack once marking has started. Re-scanning a live running stack safely would need a stop-the-world pause, which is exactly what Go's GC is designed to avoid.

### The four phases of a GC cycle

1. **Mark setup (STW, very brief):** finishes any leftover sweep work and turns on the write barrier across all goroutines. The runtime source calls this step sweep termination.
2. **Concurrent mark:** the bulk of the work, running alongside normal goroutines. Roots are scanned and the grey set is drained as described above.
3. **Mark termination (STW, brief):** drains remaining mark work, turns the write barrier off, and prepares for sweep.
4. **Concurrent sweep:** reclaims white (garbage) memory. It is also **lazy**: spans are swept incrementally as new allocations need the space (via `mallocgc`), not in one big pass.

Both STW phases are deliberately kept extremely short (typically sub-millisecond). Almost all real work happens in the concurrent phases. The spans that sweep works on are described in [Go Memory Allocator](memory-allocator.md#size-classes).

### Mutator assist

During concurrent mark, a goroutine that allocates faster than the GC workers can keep up is forced to do some marking work itself. The work is proportional to how much it just allocated, so it is a "pay as you go" throttle. It stops an allocation-heavy goroutine from outrunning the collector and ballooning the heap before the cycle finishes.

Separately, the runtime runs **dedicated background GC worker goroutines**, roughly 25% of `GOMAXPROCS` by default. They do concurrent mark work independent of any one mutator's allocation rate.

### Why non-generational and non-compacting

**Generational GC** (Java-style) relies on "most objects die young" and scans a small young generation often. Go's escape analysis already captures much of this benefit. Many short-lived objects never reach the heap and stay on the stack, which reduces the payoff of generational collection.

**Compacting (moving) GC** would reduce fragmentation and allow bump-pointer allocation. But moving objects means every pointer to them must be updated. That needs either a **read barrier** (a cost on every pointer _read_, not just writes) or full STW pauses to relocate safely.

Go prioritizes low, predictable latency over throughput, and a read barrier's constant tax on every dereference conflicts with that goal. Go also has `unsafe.Pointer` and cgo interop, where objects moving underneath a raw pointer would be dangerous.

**Interview framing:** Go gave up some throughput and memory efficiency that a generational, compacting collector could offer. In exchange it has a simpler design with much shorter and more predictable pauses. This matches the philosophy found across the runtime (incremental stack growth, bounded map splits): bounded worst-case latency over peak throughput.

### Root set

The GC's root set is **goroutine stacks** (scanned once per goroutine during mark, not continuously) plus **global variables**. Marking starts from these roots and follows pointer chains.

A global that holds stale pointers keeps everything it references alive, because the GC traces from it as a root and has no notion of "logically stale." See [the unbounded global cache gotcha](escape-analysis-gc-tuning.md#unbounded-global-cache) and [globals are GC roots](escape-analysis-gc-tuning.md#globals-are-gc-roots).

For the scheduler side of stack scanning and preemption, see [Go Scheduler (GMP)](scheduler-gmp.md).

## Gotchas

### Latency blips from mutator assist

Symptom: an allocation-heavy hot path shows unexpected latency spikes that line up with GC cycles. Cause: [mutator assist](#mutator-assist) forces mark work onto the specific goroutine that is allocating aggressively. Fix: reduce allocations on that path (see [Go Escape Analysis and GC Tuning](escape-analysis-gc-tuning.md#why-it-matters-for-hot-paths)) and measure before tuning ([measure before tuning](escape-analysis-gc-tuning.md#measure-before-tuning)).

## Interview drills

- _"If goroutine stacks are scanned once during mark, what if the stack changes after that scan?"_ → The write barrier's shading applies to the goroutine's own pointer writes, plus mutator assist cooperation. The runtime uses preemption to bring a goroutine to a safe point for its one-time scan. See [the write barrier](#the-write-barrier) and [mutator assist](#mutator-assist).
- _"Why not use a generational or compacting collector like Java?"_ → Escape analysis already captures much of the generational benefit. Compaction would need read barriers or STW pauses that conflict with Go's low-latency priority. See [why non-generational and non-compacting](#why-non-generational-and-non-compacting).
- _"Why does the hybrid barrier shade both the old and the new pointer?"_ → It closes the lost-object hazard from both directions and removes the need to re-scan stacks. See [the write barrier](#the-write-barrier).
- _"Which phases stop the world?"_ → Mark setup and mark termination, both very brief. Mark and sweep are concurrent. See [the four phases of a GC cycle](#the-four-phases-of-a-gc-cycle).

## Sources

- [`runtime/mgc.go`](https://go.dev/src/runtime/mgc.go)
- [`runtime/mbarrier.go`](https://go.dev/src/runtime/mbarrier.go)
- [`runtime/malloc.go`](https://go.dev/src/runtime/malloc.go)
- [`runtime/mheap.go`](https://go.dev/src/runtime/mheap.go)
- [`runtime/sizeclasses.go`](https://go.dev/src/runtime/sizeclasses.go)
- [A Guide to the Go Garbage Collector](https://go.dev/doc/gc-guide)
- [Getting to Go: The Journey of Go's Garbage Collector](https://go.dev/blog/ismmkeynote)
