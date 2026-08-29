# Go Escape Analysis & GC Tuning

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b2a407e452d812198a5dfbc05674dfc)

Notes from interview prep session. Companion to the Scheduler, Interfaces, Slices, Maps, and Channels pages.

> ✅ Reviewed and expanded for **Go 1.26**. Start with escape decisions, then use the tuning sections only after measuring allocation rate, GC CPU, and live heap.

## 1. What Escape Analysis Decides

Every local variable could live on the **stack** (cheap — bump the stack pointer, freed automatically on return, no GC involvement) or the **heap** (more expensive — needs GC to eventually reclaim it). The compiler's escape analysis pass decides this **at compile time**, per variable, by tracing whether a pointer to it could be reached **after the function that created it returns**.

**Rule of thumb:** if a value's address can outlive its own stack frame, it must escape to the heap — once that frame is popped, the memory could be overwritten by the next call.

## 2. Common Misconception

Taking a variable's address (`&x`) does **not** automatically force a heap allocation. The compiler cares whether the pointer _escapes the function_, not whether `&` was used:

```go
func addOne(x int) int {
    p := &x       // address taken...
    *p++
    return *p     // ...but never escapes the function — stays on the stack
}

func newCounter() *int {
    x := 0
    return &x     // address explicitly escapes via return — heap allocated
}
```

## 3. Common Causes of Escaping

- **Returning a pointer to a local** — the textbook case
- **Storing a pointer in a global variable or a longer-lived struct/slice field**
- **Passing a value into an `interface{}` parameter** — e.g. `fmt.Println(x)` often heap-allocates `x`, since the interface type erases the concrete type and the compiler generally can't prove the data won't be retained elsewhere
- **Closures that escape** — if a closure captures a variable by reference and the closure is returned, stored, or passed to `go func(){}()`, the captured variable escapes. A closure only called synchronously within the same function can keep it on the stack
- **Sending pointers or pointer-containing values on a channel** — the channel copies the value, so a scalar does not escape merely because it is sent. But pointees/captured storage may need to outlive the sender because another goroutine can retain them.
- **Size/growth the compiler can't bound at compile time** — e.g. `make([]int, n)` with a runtime variable `n` usually heap-allocates the backing array
- **Calls whose effects the compiler cannot prove** — ordinary direct calls can use exported escape summaries even without inlining, including across packages. Dynamic interface calls and other unknown callees are harder, so pointers may conservatively escape.

## 4. How to Check Escape Decisions Yourself

```bash
go build -gcflags="-m" ./...
```

Prints the compiler's actual decisions line by line (e.g. `moved to heap: x`, `x escapes to heap`). Good habit to mention for performance-sensitive codebases — concrete evidence of hands-on optimization experience.

## 5. Why It Matters for High-Throughput/Payments Work

Every heap escape = an allocation + GC pressure + eventual GC work to reclaim it. In a hot path (e.g. per-transaction processing), unnecessary escapes mean more frequent GC cycles and more CPU spent marking/sweeping instead of doing real work.

**Concrete, tellable optimizations:**

- Avoid passing small structs through `interface{}`-typed parameters (e.g. generic logging/metrics calls) in hot paths
- Choose value vs pointer receivers for semantics, mutation, copying cost, and method-set consistency—not as a blanket escape-analysis rule. Taking `&x` alone does not force `x` to the heap; verify the actual decision.
- Reuse buffers via `sync.Pool` for objects that would otherwise escape repeatedly in a loop (e.g. per-request scratch buffers)

## 6. Global Variables: Static Storage, Not Heap

A package-level variable's **storage slot itself** is reserved at compile/link time, not via the GC allocator (`mallocgc`). It lives in the binary's **data segment** (non-zero initial value) or **bss segment** (zero-valued), existing for the entire program lifetime — never "allocated" or "freed" the way heap objects are. There's no stack-vs-heap question for the global slot itself.

```go
var counter int = 0        // lives in .bss, fixed address, whole program lifetime
var config = Config{...}   // lives in .data, same story
```

**What DOES escape:** when a global (pointer/slice/map/channel/interface) has something assigned into it at runtime:

```go
var globalPtr *Foo

func init() {
    f := Foo{Name: "x"}
    globalPtr = &f   // f escapes to the heap — "stored in a global" trigger
}
```

`globalPtr` itself is static storage (an 8-byte slot), but the `Foo{}` it points to is created dynamically and escapes because its address is stored somewhere that outlives the function.

## 7. Globals Are GC Roots

The GC treats all package-level pointers (and everything reachable through them — global maps, slices, etc.) as part of its **root set**, exactly like goroutine stacks. Mark phase traces from goroutine stacks **and** globals, following pointer chains to find all reachable (live) objects.

**Production gotcha:** a global that accumulates pointers and never releases them (e.g. an ever-growing global cache map) keeps every referenced object alive forever — the GC only reclaims _unreachable_ memory, it has no concept of "logically stale." An unbounded `map[string]*Session` that never deletes expired entries holds every session alive forever, growing without bound, even though every object is still technically reachable from a root.

**Detection:** exactly what pprof's heap profile is designed to catch — steadily growing `inuse_space` with no plateau.

## 8. GC Tuning Knobs

**`GOGC`** — controls the heap-growth target. The modern model includes GC roots: `target heap = live heap + (live heap + GC roots) × GOGC / 100`. With `GOGC=100` and a small root set this is approximately 2× the live heap, but large goroutine stacks and globals make the root term significant. Lower `GOGC` trades memory for more GC CPU; higher does the reverse.

**`GOMEMLIMIT`** (Go 1.19+) — sets a **soft** limit on runtime-managed memory, approximately `runtime.MemStats.Sys - HeapReleased`. It excludes the executable's mappings, memory allocated by C/cgo, and memory the OS holds on the process's behalf. Near the limit the runtime collects more aggressively, but it may exceed the limit to avoid spending nearly all CPU in GC. In containers, leave headroom for those excluded categories rather than setting it equal to the cgroup limit.

**Recommended modern practice:** use both together—`GOGC` sets the normal CPU/memory trade-off and `GOMEMLIMIT` adds a soft pressure signal. It is not a hard OOM guarantee; validate headroom and watch runtime plus process/RSS metrics.

## 9. Go 1.26: Green Tea GC

Green Tea is the default collector implementation in Go 1.26. It changes how marking and scanning are organized to improve locality and scalability, especially for small objects; it does **not** replace Go's concurrent tracing collector or eliminate its short stop-the-world transitions, write barriers, pacer, or mark assists.

The release notes report roughly 10–40% lower GC overhead in GC-heavy programs, with workload-dependent results, plus additional vectorized scanning gains on newer amd64 CPUs. The temporary opt-out is `GOEXPERIMENT=nogreenteagc` and is expected to disappear in Go 1.27.

## 10. Measure Before Tuning

- `GODEBUG=gctrace=1` gives per-cycle timing and heap targets.
- `runtime/metrics` exposes stable GC/heap metrics for production monitoring.
- Heap profiles answer who retains memory; allocation profiles answer who creates it.
- Compare runtime-managed memory with RSS/container metrics because `GOMEMLIMIT` does not cover every byte attributed to the process.

## 11. Follow-ups to Have Ready

- _"Would you use GOGC or GOMEMLIMIT alone, or both?"_ → Both together — GOMEMLIMIT as the backstop, GOGC tuned for normal-operation efficiency.
- _"Why is an unbounded global cache a common Go memory leak, given it has a GC?"_ → GC only reclaims unreachable memory; a global holding stale-but-still-referenced entries keeps them alive forever regardless of whether they're logically still needed.

## Official Sources

- [A Guide to the Go Garbage Collector](https://go.dev/doc/gc-guide)
- [Go 1.26 release notes: Green Tea GC](https://go.dev/doc/go1.26)
- [`runtime/debug.SetMemoryLimit`](https://pkg.go.dev/runtime/debug#SetMemoryLimit)
- [Compiler diagnostics (`-gcflags=-m`)](https://pkg.go.dev/cmd/compile)
