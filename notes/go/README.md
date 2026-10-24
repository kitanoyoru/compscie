---
title: Go
status: active
started: 2026-08-23
---

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

## Notes

One file per note, flat in this folder. Start one with `make note TOPIC=go NOTE=<slug>`; the list below rebuilds on commit.

<!-- notes:start - generated, newest first -->

- 2026-08-23 - [📡 Go Channels — Internals, sudog, and Select](channels.md)
- 2026-08-23 - [Go context Package — Cancellation Trees, Value Lookup, and Anti-Patterns](context-package-internals.md)
- 2026-08-23 - [🧭 Go Context — Cancellation, Deadlines, and Ownership](context.md)
- 2026-08-23 - [Go Deadlock Detector — checkdead()](deadlock-detector.md)
- 2026-08-23 - [Go defer — Semantics, Open-Coded Implementation, and Gotchas](defer.md)
- 2026-08-23 - [Go Escape Analysis & GC Tuning](escape-analysis-gc-tuning.md)
- 2026-08-23 - [Go Garbage Collector — Tri-Color Marking, Write Barriers, and Phases](garbage-collector.md)
- 2026-08-23 - [Go Generics — Constraints, Inference, and GCShape](generics.md)
- 2026-08-23 - [Go Interfaces — Internal Representation & Nil-Pointer Trap](interfaces.md)
- 2026-08-23 - [Go Maps — Legacy Bucket Design (Before Go 1.24)](maps-legacy-buckets.md)
- 2026-08-23 - [Go Maps — Swiss Tables (Go 1.24+)](maps-swiss-tables.md)
- 2026-08-23 - [Go Memory Allocator — mcache/mcentral/mheap, Size Classes, Arenas](memory-allocator.md)
- 2026-08-23 - [🧠 Go Memory Model — Practical Happens-Before Guide](memory-model.md)
- 2026-08-23 - [Go sync.Mutex — Internals](mutex.md)
- 2026-08-23 - [Go sync.RWMutex — Internals and Recursive RLock](rwmutex.md)
- 2026-08-23 - [⚙️ Go Scheduler (GMP) — Interview Prep Notes](scheduler-gmp.md)
- 2026-08-23 - [Go Slices — Internals, Aliasing, and Growth](slices.md)
- 2026-08-23 - [Go Timers and Tickers — Current Semantics and Safe Patterns](timers-tickers.md)
- 2026-08-23 - [Go sync.WaitGroup — State, Ordering, and WaitGroup.Go](waitgroup.md)

<!-- notes:end -->

> 🔬 **Measurement rule:** diagnose before tuning. Escape diagnostics explain compiler decisions; benchmarks, allocation profiles, GC traces, and execution traces show whether those decisions matter.

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
