# 🐹 Go

Deep-dive notes on Go internals and production engineering, organized for **senior/staff interview preparation** and day-to-day debugging.

> 📌 **Baseline: Go 1.26.5 · reviewed 4 Aug 2026.** Version-sensitive claims are checked against current Go documentation and runtime source. Pages separate language guarantees from implementation details.

> Exported from Notion on 2026-08-23 · [Source hub](https://app.notion.com/p/3b1a407e452d8146b740cf476307fa90)

## Recommended First Pass

1. Scheduler → Channels → Memory Model
2. Mutex → RWMutex → WaitGroup
3. Slices → Interfaces → Maps

## Use This KB For

- Interview drills
- Production gotcha lookup
- Version-aware runtime internals
- Official source links

## Learning Paths

- **Concurrency foundations:** Scheduler → Channels → Memory Model → Context → Timers
- **Synchronization internals:** Mutex → RWMutex → WaitGroup → Memory Model
- **Data representation:** Slices → Interfaces → Generics → Maps
- **Performance debugging:** Scheduler → Escape Analysis & GC → collection internals
- **Version-aware interviews:** Swiss Maps first; legacy maps only as historical context

## Concurrency & Runtime

Start with the scheduler. The remaining pages reuse its G/M/P, parking, wake-up, and synchronization vocabulary.

1. [Go Scheduler (GMP)](01-concurrency-runtime/01-scheduler-gmp.md)
2. [Channels — Internals, sudog, and Select](01-concurrency-runtime/02-channels.md)
3. [Memory Model — Practical Happens-Before Guide](01-concurrency-runtime/03-memory-model.md)
4. [Context — Cancellation, Deadlines, and Ownership](01-concurrency-runtime/04-context.md)
5. [context Package — Cancellation Trees, Value Lookup, Anti-Patterns](01-concurrency-runtime/05-context-package-internals.md)
6. [Timers and Tickers — Current Semantics and Safe Patterns](01-concurrency-runtime/06-timers-tickers.md)
7. [Deadlock Detector — `checkdead()`](01-concurrency-runtime/07-deadlock-detector.md)

## Synchronization Primitives

1. [`sync.Mutex` — Internals](02-sync-primitives/01-mutex.md)
2. [`sync.RWMutex` — Internals and Recursive RLock](02-sync-primitives/02-rwmutex.md)
3. [`sync.WaitGroup` — State, Ordering, and `WaitGroup.Go`](02-sync-primitives/03-waitgroup.md)

## Memory & Performance

1. [Escape Analysis & GC Tuning](03-memory-performance/01-escape-analysis-gc-tuning.md)
2. [Garbage Collector — Tri-Color Marking, Write Barriers, Phases](03-memory-performance/02-garbage-collector.md)
3. [Memory Allocator — mcache/mcentral/mheap, Size Classes, Arenas](03-memory-performance/03-memory-allocator.md)

> 🔬 **Measurement rule:** diagnose before tuning. Escape diagnostics explain compiler decisions; benchmarks, allocation profiles, GC traces, and execution traces show whether those decisions matter.

## Data Structures & Type System

1. [Slices — Internals, Aliasing, and Growth](04-data-structures/01-slices.md)
2. [Interfaces — Internal Representation & Nil-Pointer Trap](04-data-structures/02-interfaces.md)
3. [Generics — Constraints, Inference, and GCShape](04-data-structures/03-generics.md)
4. [Maps — Swiss Tables (Go 1.24+)](04-data-structures/04-maps-swiss-tables.md)
5. [Maps — Legacy Bucket Design (Before Go 1.24)](04-data-structures/05-maps-legacy-buckets.md)

## Language

1. [`defer` — Semantics, Open-Coded Implementation, and Gotchas](05-language/01-defer.md)

## Cross-Cutting Gotcha Index

| Symptom | Where to look |
| --- | --- |
| Unrelated data changed after `append` | Slices §3 |
| API emits `null` instead of `[]` | Slices §6 |
| Truncated slice still retains memory | Slices §5 |
| Worker spins after one input closes | Channels §6, nil-channel idiom |
| Goroutine count grows without a deadlock crash | Deadlock §3/§7 and Context §8 |
| `Wait` returns before work finishes | WaitGroup §3/§6 |
| Recursive read lock hangs | RWMutex §4 |
| Timer appears to deliver an old tick | Timers §2; check module/version semantics |
| Pod is CPU-throttled despite low average CPU | Scheduler §3 |
| RSS stays high after a spike | Scheduler §11 and Escape & GC §8–10 |
| Type "doesn't implement" an interface | Interfaces §3, method sets |
| `err != nil` after returning a typed nil | Interfaces §6 |
| `fatal error: concurrent map writes` | Swiss Maps §6 |

## The Design Philosophy Connecting These Pages

- **Amortize work.** Bounded Swiss-table splits, geometric stack growth, and incremental GC avoid one giant stall.
- **Optimize the common path.** Mutex CAS, `runnext`, direct channel handoff, and local run queues make uncontended/local work cheap.
- **Make ownership explicit.** Channels transfer work, contexts propagate lifecycle, locks protect shared invariants, and timer creators own cancellation.
- **Prefer guarantees over folklore.** The memory model, package contracts, and version boundaries outrank scheduler timing or old recipes.
- **Measure the system you run.** Runtime internals explain profiles; they do not replace profiles.

## Coverage & Next Topics

**Covered:** scheduler, channels, locks, WaitGroup, memory model, context, timers, deadlock detection; slices, interfaces, generics, Swiss maps, historical bucket maps; escape analysis, GC controls, allocator, `defer`, and the measurement workflow.

**Next:**

- [ ] **pprof and runtime/trace** — CPU, heap, block, mutex, goroutine-leak, and execution-trace workflows
- [ ] **Strings and runes** — UTF-8 iteration, conversion costs, `strings.Builder`
- [ ] **Remaining `sync`** — `Once`, `Pool`, `Cond`, typed atomics, and semaphore patterns

<details>
<summary>Maintenance checklist</summary>

- Re-check runtime-layout claims at each major Go release.
- Label unexported layouts and scheduler/compiler behavior as implementation details.
- Prefer official package docs, the language spec, memory model, release notes, and tagged runtime source.
- Keep pages skimmable: summary → model → gotchas → drills → sources.

</details>
