---
date: 2026-08-23
---

# Go Escape Analysis and GC Tuning

> The compiler decides at build time whether each variable lives on the stack or the heap, based on whether a pointer to it can outlive the function. Every heap escape adds allocation and GC work, so fewer escapes on hot paths means less GC pressure. Tune `GOGC` and `GOMEMLIMIT` only after measuring allocation rate, GC CPU, and live heap. Reviewed for Go 1.26.

## Questions this answers

- How does the compiler decide between stack and heap?
- What are the common causes of escaping, and how do I check them?
- Why is a global variable not a heap allocation, yet still a GC root?
- What do `GOGC` and `GOMEMLIMIT` control, and should I use both?
- What changes with Green Tea GC in Go 1.26?
- What should I measure before tuning?

## Notes

### What escape analysis decides

Every local variable could live on the **stack** or the **heap**:

- The stack is cheap: bump the stack pointer, freed automatically on return, no GC involvement.
- The heap is more expensive: it needs the GC to eventually reclaim the memory.

The compiler's escape analysis pass decides this **at compile time**, per variable. It traces whether a pointer to the variable could be reached **after the function that created it returns**.

**Rule of thumb:** if a value's address can outlive its own stack frame, it must escape to the heap. Once that frame is popped, the memory could be overwritten by the next call.

### Common causes of escaping

- **Returning a pointer to a local.** This is the textbook case.
- **Storing a pointer in a global variable or a longer-lived struct or slice field.**
- **Passing a value into an `interface{}` parameter.** For example, `fmt.Println(x)` often heap-allocates `x`. The interface type erases the concrete type, and the compiler generally cannot prove the data is not retained elsewhere.
- **Closures that escape.** If a closure captures a variable by reference and the closure is returned, stored, or passed to `go func(){}()`, the captured variable escapes. A closure only called synchronously within the same function can keep it on the stack.
- **Sending pointers or pointer-containing values on a channel.** The channel copies the value, so a scalar does not escape merely because it is sent. But the pointees or captured storage may need to outlive the sender, because another goroutine can retain them.
- **Size or growth the compiler cannot bound at compile time.** For example, `make([]int, n)` with a runtime variable `n` usually heap-allocates the backing array.
- **Calls whose effects the compiler cannot prove.** Ordinary direct calls can use exported escape summaries even without inlining, including across packages. Dynamic interface calls and other unknown callees are harder, so pointers may conservatively escape.

### Checking escape decisions

```sh
go build -gcflags="-m" ./...
```

This prints the compiler's actual decisions line by line (for example `moved to heap: x` or `x escapes to heap`). It is a good habit to mention for performance-sensitive codebases, because it is concrete evidence of hands-on optimization experience.

### Why it matters for hot paths

Every heap escape means an allocation, GC pressure, and eventual GC work to reclaim it. In a hot path (for example per-transaction processing), unnecessary escapes cause more frequent GC cycles. More CPU goes into marking and sweeping instead of real work.

**Concrete, tellable optimizations:**

- Avoid passing small structs through `interface{}`-typed parameters (for example generic logging or metrics calls) in hot paths.
- Choose value vs pointer receivers for semantics, mutation, copying cost, and method-set consistency, not as a blanket escape-analysis rule. Taking `&x` alone does not force `x` to the heap, so verify the actual decision.
- Reuse buffers via `sync.Pool` for objects that would otherwise escape repeatedly in a loop (for example per-request scratch buffers).

### Globals: static storage, not heap

A package-level variable's **storage slot itself** is reserved at compile/link time, not through the GC allocator (`mallocgc`). It lives in the binary's **data segment** (non-zero initial value) or **bss segment** (zero-valued) for the whole program lifetime. It is never "allocated" or "freed" like a heap object, so there is no stack-vs-heap question for the global slot itself.

```go
var counter int = 0        // lives in .bss, fixed address, whole program lifetime
var config = Config{...}   // lives in .data, same story
```

**What does escape:** a global (pointer, slice, map, channel, or interface) that has something assigned into it at runtime.

```go
var globalPtr *Foo

func init() {
    f := Foo{Name: "x"}
    globalPtr = &f   // f escapes to the heap — "stored in a global" trigger
}
```

`globalPtr` itself is static storage (an 8-byte slot). The `Foo{}` it points to is created dynamically and escapes, because its address is stored somewhere that outlives the function.

### Globals are GC roots

The GC treats all package-level pointers, and everything reachable through them (global maps, slices, and so on), as part of its **root set**, exactly like goroutine stacks. The mark phase traces from goroutine stacks **and** globals, following pointer chains to find all live objects. The full algorithm is in [Go Garbage Collector](garbage-collector.md#tri-color-marking) and the root set is described in [root set](garbage-collector.md#root-set).

The consequence for leaks is covered in [the unbounded global cache gotcha](#unbounded-global-cache).

### GC tuning knobs

**`GOGC`** controls the heap-growth target. The modern model includes GC roots:

```text
target heap = live heap + (live heap + GC roots) × GOGC / 100
```

With `GOGC=100` and a small root set this is approximately 2× the live heap. Large goroutine stacks and globals make the root term significant. Lower `GOGC` trades memory for more GC CPU. Higher does the reverse.

**`GOMEMLIMIT`** (Go 1.19+) sets a **soft** limit on runtime-managed memory, approximately `runtime.MemStats.Sys - HeapReleased`. It excludes the executable's mappings, memory allocated by C/cgo, and memory the OS holds on the process's behalf. Near the limit the runtime collects more aggressively, but it may exceed the limit to avoid spending nearly all CPU in GC. In containers, leave headroom for those excluded categories instead of setting it equal to the cgroup limit.

**Recommended modern practice:** use both together. `GOGC` sets the normal CPU/memory trade-off and `GOMEMLIMIT` adds a soft pressure signal. It is not a hard OOM guarantee, so validate headroom and watch runtime plus process/RSS metrics.

### Green Tea GC in Go 1.26

Green Tea is the default collector implementation in Go 1.26. It changes how marking and scanning are organized to improve locality and scalability, especially for small objects. It does **not** replace Go's concurrent tracing collector. The short stop-the-world transitions, write barriers, pacer, and mark assists are all still there. See [Go Garbage Collector](garbage-collector.md#the-four-phases-of-a-gc-cycle).

The release notes report roughly 10-40% lower GC overhead in GC-heavy programs, with workload-dependent results, plus additional vectorized scanning gains on newer amd64 CPUs. The temporary opt-out is `GOEXPERIMENT=nogreenteagc`, and it is expected to disappear in Go 1.27.

### Measure before tuning

- `GODEBUG=gctrace=1` gives per-cycle timing and heap targets.
- `runtime/metrics` exposes stable GC and heap metrics for production monitoring.
- Heap profiles answer who retains memory. Allocation profiles answer who creates it.
- Compare runtime-managed memory with RSS and container metrics, because `GOMEMLIMIT` does not cover every byte attributed to the process.

## Gotchas

### Taking an address does not force a heap allocation

Symptom: code avoids `&x` out of fear of heap allocation. Cause: the compiler cares whether the pointer _escapes the function_, not whether `&` was used.

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

Fix: check the real decision with `go build -gcflags="-m"` ([checking escape decisions](#checking-escape-decisions)).

### Unbounded global cache

Symptom: memory grows without bound, even though Go has a GC. Cause: a global that accumulates pointers and never releases them keeps every referenced object alive forever. The GC only reclaims _unreachable_ memory and has no concept of "logically stale." An unbounded `map[string]*Session` that never deletes expired entries holds every session alive, even though each object is still technically reachable from a root ([globals are GC roots](#globals-are-gc-roots)).

Detection: this is exactly what the pprof heap profile is designed to catch, as steadily growing `inuse_space` with no plateau. Fix: bound or expire the entries.

## Interview drills

- _"Would you use `GOGC` or `GOMEMLIMIT` alone, or both?"_ → Both together. `GOMEMLIMIT` is the backstop and `GOGC` is tuned for normal-operation efficiency. See [GC tuning knobs](#gc-tuning-knobs).
- _"Why is an unbounded global cache a common Go memory leak, given it has a GC?"_ → The GC only reclaims unreachable memory. A global holding stale-but-still-referenced entries keeps them alive forever, regardless of whether they are logically still needed. See [unbounded global cache](#unbounded-global-cache).
- _"Does taking `&x` force `x` onto the heap?"_ → No. It escapes only if the pointer outlives the function. See [taking an address does not force a heap allocation](#taking-an-address-does-not-force-a-heap-allocation).
- _"What do you check before touching `GOGC`?"_ → Allocation rate, GC CPU, and live heap, using `gctrace` and `runtime/metrics`. See [measure before tuning](#measure-before-tuning).

## Sources

- [A Guide to the Go Garbage Collector](https://go.dev/doc/gc-guide)
- [Go 1.26 release notes: Green Tea GC](https://go.dev/doc/go1.26)
- [`runtime/debug.SetMemoryLimit`](https://pkg.go.dev/runtime/debug#SetMemoryLimit)
- [Compiler diagnostics (`-gcflags=-m`)](https://pkg.go.dev/cmd/compile)
