# Go Garbage Collector — Tri-Color Marking, Write Barriers, and Phases

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b3a407e452d81c698fde6b2a72945ed)

Notes from interview prep session. Companion to "Go Escape Analysis & GC Tuning" and the Scheduler docs (stack scanning, preemption).

## 1. What Kind of Collector Go Uses

Go's GC is a **concurrent, tri-color, mark-and-sweep collector**:

- **Concurrent** — runs alongside normal goroutines, not by fully stopping the world for the whole cycle. Headline feature: sub-millisecond STW pauses.
- **Tri-color** — the core marking algorithm (below).
- **Non-generational, non-compacting** — unlike Java's collectors, no young/old segregation, and objects are never moved in memory to defragment. Deliberate tradeoff, not an oversight (see §6).

## 2. Tri-Color Marking

Every object is conceptually one of three colors during a cycle:

- **White**: not yet visited. Anything still white at cycle end is garbage.
- **Grey**: visited, but its own outgoing pointers haven't been scanned yet.
- **Black**: visited, and all outgoing pointers scanned — fully processed, definitely live.

**Algorithm:** mark every root (goroutine stacks, globals) grey. Repeatedly pick a grey object, mark each white pointer target it holds as grey, then turn that object black. Continue until no grey objects remain. Whatever's still white is provably unreachable — safe to reclaim.

## 3. The Concurrency Problem and the Write Barrier

**The hazard:** mutator goroutines keep running and mutating the pointer graph while marking happens. If a black (already "done") object gets a new pointer written into it pointing to a white object, and simultaneously the last grey reference to that white object is removed elsewhere, the GC never revisits the black object — that white object gets incorrectly collected while still reachable. Catastrophic bug: a live pointer pointing at freed memory.

**Fix — the hybrid write barrier** (since Go 1.8): compiler-inserted code around every pointer write during concurrent mark:

```javascript
writePointer(slot, newPtr):
    shade(*slot)     // shade the OLD value being overwritten
    shade(newPtr)    // shade the NEW value being written
    *slot = newPtr
```

Shading both old and new values closes the hazard from both directions. **Key engineering win:** this works WITHOUT requiring the GC to re-scan any goroutine's stack once marking has started — stack rescanning would need a stop-the-world pause to safely re-examine a live running stack, exactly what Go's GC is designed to avoid.

## 4. The Four Phases of a GC Cycle

1. **Mark Setup (STW, very brief)** — turns on the write barrier across all goroutines
2. **Concurrent Mark** — bulk of the work, runs alongside normal goroutines. Roots scanned, grey set drained as above
3. **Mark Termination (STW, brief)** — drains remaining mark work, turns write barrier back off, prepares for sweep
4. **Concurrent Sweep** — reclaims white (garbage) memory. Also **lazy**: swept incrementally as new allocations need that space (via mallocgc calls), not one big pass

Both STW phases are deliberately kept extremely short (typically sub-millisecond) — almost all real work happens in the concurrent phases.

## 5. Mutator Assist — the Throttling Mechanism

During concurrent mark, if a goroutine allocates memory faster than GC workers can keep pace, that goroutine is forced to do some marking work itself, proportional to how much it just allocated — a "pay as you go" throttle. Prevents an allocation-heavy goroutine from outrunning the collector and ballooning the heap before the cycle finishes.

**Production relevance:** an allocation-heavy hot path can show unexpected latency blips tied to GC — that's mutator assist work forced onto that specific goroutine because it's the one allocating aggressively.

Separately, the runtime also runs **dedicated background GC worker goroutines** (roughly 25% of GOMAXPROCS by default) doing concurrent mark work independent of any specific mutator's allocation rate.

## 6. Why Non-Generational and Non-Compacting — the Tradeoff

**Generational GC** (Java-style) exploits "most objects die young" by scanning a small young generation frequently. Go's escape analysis already captures much of this benefit — many short-lived objects never reach the heap at all, staying on the stack instead — reducing the payoff generational collection would offer.

**Compacting/moving GC** would reduce fragmentation and allow bump-pointer allocation, but moving objects means every pointer to them must be updated — requiring either a **read barrier** (cost on every single pointer READ, not just writes) or full STW pauses to safely relocate things. Go explicitly prioritizes low, predictable latency over throughput; a read barrier's constant tax on every pointer dereference conflicts directly with that goal. Go also has `unsafe.Pointer` and cgo interop, where objects moving underneath a raw pointer would be genuinely dangerous.

**Interview framing:** Go traded some throughput and memory efficiency a generational, compacting collector could offer, in exchange for a simpler design with much more predictable, much shorter pause times — consistent with the same philosophy seen throughout the runtime (incremental stack growth, bounded map splits): bounded worst-case latency over peak throughput.

## 7. Root Set

The GC's root set = **goroutine stacks** (scanned once per goroutine during mark, not continuously) + **global variables**. Same mechanism referenced in the escape analysis doc: a global holding stale pointers keeps everything it references alive because GC traces from it as a root, with no notion of "logically stale."

## 8. Follow-ups to Have Ready

- *"If goroutine stacks are scanned once during mark, what if the stack changes after that scan?"* → Covered by the write barrier's shading logic applied to the goroutine's own pointer writes, plus mutator assist cooperation — the runtime uses preemption to bring a goroutine to a safe point for its one-time scan.
- *"Why not use a generational or compacting collector like Java?"* → See §6 — escape analysis already captures much of the generational benefit; compaction would require read barriers or STW pauses that conflict with Go's low-latency priority.
