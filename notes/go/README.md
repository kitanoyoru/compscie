---
title: Go
status: active
started: 2026-08-23
focus: Runtime internals and production debugging.
next: Add pprof and runtime/trace workflows.
concepts: Runtime, Concurrency, Memory, Production diagnostics
---

# Go

<!-- status: planned | active | paused | done. The root README reads the block above.
     concepts: comma-separated, in the order the Knowledge Map draws them; each note lists the ones it covers. -->

Notes on Go internals and production engineering, written for senior and staff interview preparation and for day-to-day debugging.

Baseline: Go 1.26.5, reviewed on 4 Aug 2026. Version-sensitive claims are checked against the Go documentation and runtime source, and every note separates language guarantees from implementation details. The notes started as a Notion knowledge base and were imported on 2026-08-23 ([source hub](https://app.notion.com/p/3b1a407e452d8146b740cf476307fa90)).

## Reading order

Start with three short passes:

1. [Scheduler](scheduler-gmp.md) → [Channels](channels.md) → [Memory Model](memory-model.md)
2. [Mutex](mutex.md) → [RWMutex](rwmutex.md) → [WaitGroup](waitgroup.md)
3. [Slices](slices.md) → [Interfaces](interfaces.md) → [Maps: Swiss Tables](maps-swiss-tables.md)

Then follow the path that matches what you need:

| Path | Notes |
| --- | --- |
| Concurrency foundations | [Scheduler](scheduler-gmp.md) → [Channels](channels.md) → [Memory Model](memory-model.md) → [Context](context.md) → [Timers](timers-tickers.md) |
| Synchronization internals | [Mutex](mutex.md) → [RWMutex](rwmutex.md) → [WaitGroup](waitgroup.md) → [Memory Model](memory-model.md) |
| Data representation | [Slices](slices.md) → [Interfaces](interfaces.md) → [Generics](generics.md) → [Maps: Swiss Tables](maps-swiss-tables.md) |
| Memory and performance | [Allocator](memory-allocator.md) → [Garbage Collector](garbage-collector.md) → [Escape Analysis and GC Tuning](escape-analysis-gc-tuning.md) |
| Failure modes | [defer](defer.md) → [Deadlock Detector](deadlock-detector.md) → [Context](context.md#leak-and-shutdown-patterns) |
| Version-aware interviews | [Maps: Swiss Tables](maps-swiss-tables.md) first; [Maps: Legacy Buckets](maps-legacy-buckets.md) only as history |

## Notes

One file per note, flat in this folder. Start one with `make note TOPIC=go NOTE=<slug>`; the list below rebuilds on commit.

<!-- notes:start - generated, newest first -->

- 2026-08-23 - [Go Channels](channels.md)
- 2026-08-23 - [Go Context](context.md)
- 2026-08-23 - [Go Deadlock Detector](deadlock-detector.md)
- 2026-08-23 - [Go defer](defer.md)
- 2026-08-23 - [Go Escape Analysis and GC Tuning](escape-analysis-gc-tuning.md)
- 2026-08-23 - [Go Garbage Collector](garbage-collector.md)
- 2026-08-23 - [Go Generics](generics.md)
- 2026-08-23 - [Go Interfaces](interfaces.md)
- 2026-08-23 - [Go Maps: Legacy Buckets (before Go 1.24)](maps-legacy-buckets.md)
- 2026-08-23 - [Go Maps: Swiss Tables (Go 1.24+)](maps-swiss-tables.md)
- 2026-08-23 - [Go Memory Allocator](memory-allocator.md)
- 2026-08-23 - [Go Memory Model](memory-model.md)
- 2026-08-23 - [Go sync.Mutex](mutex.md)
- 2026-08-23 - [Go sync.RWMutex](rwmutex.md)
- 2026-08-23 - [Go Scheduler (GMP)](scheduler-gmp.md)
- 2026-08-23 - [Go Slices](slices.md)
- 2026-08-23 - [Go Timers and Tickers](timers-tickers.md)
- 2026-08-23 - [Go sync.WaitGroup](waitgroup.md)

<!-- notes:end -->

## Gotcha index

| Symptom | Where to look |
| --- | --- |
| Unrelated data changed after `append` | [Slices: the classic append gotcha](slices.md#the-classic-append-gotcha) |
| API emits `null` instead of `[]` | [Slices: nil vs empty slice](slices.md#nil-vs-empty-slice) |
| Truncated slice still retains memory | [Slices: capacity retention](slices.md#capacity-retention) |
| Worker spins after one input closes | [Channels: nil-channel idiom in `select`](channels.md#nil-channel-idiom-in-select) |
| Goroutine count grows without a deadlock crash | [Deadlock Detector: global, not pairwise](deadlock-detector.md#global-not-pairwise), [detecting leaks](deadlock-detector.md#detecting-leaks-the-runtime-wont-report), [Context: leak and shutdown patterns](context.md#leak-and-shutdown-patterns) |
| `Wait` returns before the work finishes | [WaitGroup: Add and Wait ordering](waitgroup.md#add-and-wait-ordering), [`WaitGroup.Go`](waitgroup.md#waitgroupgo) |
| Recursive read lock hangs | [RWMutex: recursive `RLock` deadlock](rwmutex.md#recursive-rlock-deadlock) |
| Timer appears to deliver an old tick | [Timers: Go 1.23+ timer channel semantics](timers-tickers.md#go-123-timer-channel-semantics); check the module's Go version |
| Pod is CPU-throttled despite low average CPU | [Scheduler: GOMAXPROCS](scheduler-gmp.md#gomaxprocs) |
| RSS stays high after a spike | [Scheduler: idle memory and scavenging](scheduler-gmp.md#idle-memory-and-scavenging), [GC tuning knobs](escape-analysis-gc-tuning.md#gc-tuning-knobs), [measure before tuning](escape-analysis-gc-tuning.md#measure-before-tuning) |
| Type "doesn't implement" an interface | [Interfaces: method sets](interfaces.md#method-sets) |
| `err != nil` after returning a typed nil | [Interfaces: the nil-pointer trap](interfaces.md#the-nil-pointer-trap) |
| `fatal error: concurrent map writes` | [Swiss Tables: concurrent map writes](maps-swiss-tables.md#fatal-error-concurrent-map-writes) |
| Context lingers after the handler returns | [Context: lost cancel](context.md#lost-cancel) |
| File descriptors run out in a loop | [defer: defer inside a loop](defer.md#defer-inside-a-loop) |

## Themes that connect the notes

- **Amortize work.** Bounded Swiss-table splits, geometric stack growth and incremental GC avoid one giant stall.
- **Optimize the common path.** Mutex CAS, `runnext`, direct channel handoff and local run queues make uncontended, local work cheap.
- **Make ownership explicit.** Channels transfer work, contexts propagate lifecycle, locks protect shared invariants, and timer creators own cancellation.
- **Prefer guarantees over folklore.** The memory model, package contracts and version boundaries outrank scheduler timing or old recipes.
- **Measure the system you run.** Diagnose before tuning. Escape diagnostics explain compiler decisions; benchmarks, allocation profiles, GC traces and execution traces show whether those decisions matter.

## Coverage and next topics

**Covered:** scheduler, channels, locks, WaitGroup, memory model, context, timers, deadlock detection; slices, interfaces, generics, Swiss maps and the historical bucket maps; escape analysis, GC controls, the allocator, `defer`, and the measurement workflow.

**Next:**

- [ ] **pprof and runtime/trace:** CPU, heap, block, mutex, goroutine-leak and execution-trace workflows.
- [ ] **Strings and runes:** UTF-8 iteration, conversion costs, `strings.Builder`.
- [ ] **Remaining `sync`:** `Once`, `Pool`, `Cond`, typed atomics and semaphore patterns.

## Maintenance

- Re-check runtime-layout claims at each major Go release.
- Label unexported layouts and scheduler or compiler behavior as implementation details.
- Prefer official package docs, the language spec, the memory model, release notes and tagged runtime source.
- Keep every note in the same shape: TL;DR, questions, notes, gotchas, interview drills, sources.
