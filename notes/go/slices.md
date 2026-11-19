---
date: 2026-08-23
concepts: Memory
---

# Go Slices

> A slice is a small header (pointer, length, capacity) over a backing array. Copying a slice copies the header and never the array, so overlapping slices share memory and `append` may or may not reallocate. Checked against Go 1.26.

## Questions this answers

- What is inside a slice header, and what is copied when a slice is passed to a function?
- Why can `append` silently overwrite data that belongs to another slice?
- How much capacity does `append` add, and when should I preallocate?
- Why does a tiny slice keep a huge array alive, and why does a pooled buffer leak?
- Why does my API return `null` instead of `[]`?
- What do `copy()` and string to `[]byte` conversions cost?

## Notes

### Slice header

A slice is a small header struct, not the data itself:

```go
type sliceHeader struct {
    ptr *T   // pointer to first element in the backing array
    len int  // number of elements currently accessible
    cap int  // number of elements the backing array can hold from ptr onward
}
```

The header is 24 bytes on 64-bit (a pointer and two ints). It is copied when passed to a function, but the **backing array is not copied**. This is why slices act like reference types for mutation but like value types for length and capacity changes.

**Consequence worth stating explicitly:** a function that only _mutates elements_ needs no pointer. A function that calls `append` and wants the caller to see the result must either return the slice or take a `*[]T`. This is the whole reason `append` returns a value.

### Backing array aliasing

Re-slicing (`a := s[1:3]`, `b := s[2:5]`) creates new headers that point into the **same underlying backing array**, at different offsets and lengths. Writing through one slice is visible through any other slice whose range overlaps in the shared array. For example, `a[1] = 99` also changes `b[0]` if their ranges overlap.

**Bounds detail:** `s[low:high]` may extend `high` up to `cap(s)`, not just `len(s)`. So a slice can be re-grown into capacity it cannot currently "see". This is exactly the mechanism behind [the classic append gotcha](#the-classic-append-gotcha).

### Growth factor on reallocation

When `append` needs a new backing array, `growslice` picks the new capacity:

```go
// runtime/slice.go, simplified — Go 1.18+
const threshold = 256
if newLen > 2*oldCap {
    newcap = newLen                    // huge single append: just fit it
} else if oldCap < threshold {
    newcap = 2 * oldCap                // small: double
} else {
    for newcap < newLen {
        newcap += (newcap + 3*threshold) / 4   // large: ~1.25x, smoothly
    }
}
```

- Small slices: capacity **doubles**.
- **Since Go 1.18**, past roughly 256 elements, growth transitions toward about **1.25x**. The formula is a _smooth_ transition, not a hard cliff. Before 1.18 the threshold was 1024 with an abrupt jump from 2x to 1.25x, which caused visible allocation-size discontinuities.
- The result is then **rounded up to an allocator size class** (see [Go Memory Allocator](memory-allocator.md): 8, 16, 32, 48, 64, 80... bytes). So the actual `cap()` after growth often is not a clean number. Appending one element at a time to an empty `[]int` gives capacities 1, 2, 4, 8..., but for odd element sizes the rounding is visible.

**Perf story for high-throughput code:** preallocate with `make([]T, 0, expectedSize)` when the approximate final size is known, for example when batching Kafka messages before a flush. This avoids N reallocations and N copies as the batch grows. Growing a slice from 0 to N by appending is O(N) total copying and gives amortized O(1) append. The exact number of allocations and copied elements depends on the runtime growth algorithm, element size, and allocator size-class rounding, so do not summarize it as a stable `2N` constant.

**Go 1.26 note:** the compiler now stack-allocates slice backing stores in more situations than before, so some previously heap-allocating hot paths got free wins on upgrade. Escape analysis still decides. Check with `go build -gcflags='-m'`.

### Why slices are not comparable

A slice header is an implementation model, not the slice's value semantics. Comparing only `(ptr, len, cap)` would ask "are these two views identical?", not "do these sequences contain equal elements?". Two different backing arrays can contain the same values, while two headers sharing an array can expose different ranges. Element-wise equality would also make `==` potentially O(n), could panic for non-comparable element types, and would make slices unusable as stable map keys because their elements are mutable.

Therefore slices are comparable only to `nil`. For contents, use `slices.Equal` or `slices.EqualFunc`. For identity and aliasing questions, make that intent explicit rather than treating the header as language-level equality.

### What `copy()` actually costs

`copy(dst, src)` copies `min(len(dst), len(src))` elements and returns that count. It is a **builtin, not a library function**, and the compiler lowers it directly:

- For pointer-free element types it becomes `runtime.memmove`, an optimized, architecture-specific block move (SSE/AVX on amd64). It handles overlapping ranges correctly, unlike C's `memcpy`.
- For element types **containing pointers** it becomes `runtime.typedslicecopy`, which is memmove **plus write barriers** for the GC. This is measurably more expensive during an active GC mark phase.

**Cost model:** O(n) in bytes, with a very low constant. It is usually bandwidth-bound rather than instruction-bound. Copying a `[]byte` is cheap. Copying a `[]*Foo` or `[]SomeStructWithPointers` of the same byte size is _not_ equally cheap, because of the barrier work. On a hot path, prefer pointer-free element types.

**Special case:** `copy(dstBytes, srcString)` is legal. It is the one place the type rules bend, and it lets you copy a string into a `[]byte` without a conversion allocation.

`copy` does **not** grow `dst`. `copy(make([]int, 0, 10), src)` copies **zero** elements, which is a classic bug. Use `make([]int, len(src))`.

### Converting between string and `[]byte`

Strings are immutable and `[]byte` is not. So in general **both directions allocate and copy**: `[]byte(s)` and `string(b)` are O(n) with a heap allocation, because the runtime must guarantee that later mutation of the `[]byte` cannot be observed through the string.

The compiler optimizes several important cases into **zero-allocation** code:

| Pattern                          | Allocates? | Why                                 |
| -------------------------------- | ---------- | ----------------------------------- |
| `m[string(b)]` (map lookup)      | **No**     | Temp string can't escape the lookup |
| `string(b) == "literal"`         | **No**     | Comparison only                     |
| `for i, r := range string(b)`    | **No**     | Iteration only                      |
| `switch string(b) { ... }`       | **No**     | Comparison only                     |
| `s := string(b)` stored/returned | **Yes**    | Escapes; must own its bytes         |
| `[]byte(s)` then mutated         | **Yes**    | Must not alias the string           |

Short strings (up to 32 bytes) may use a small stack buffer instead of the heap when the compiler proves non-escape.

**The unsafe escape hatch** (Go 1.20+, the _supported_ form; do not use the old `reflect.StringHeader` casts):

```go
func unsafeString(b []byte) string {
    return unsafe.String(unsafe.SliceData(b), len(b))
}
func unsafeBytes(s string) []byte {
    return unsafe.Slice(unsafe.StringData(s), len(s))
}
```

**Contract:** the resulting string is valid only while the backing bytes are unmodified. The `[]byte` made from a string must **never** be written to, because string data may live in read-only memory and writing segfaults. This is legitimate in hot paths where you control both sides and a landmine anywhere else. A realistic interview answer: "I'd reach for this only inside a tight, well-tested internal decoder, and I'd benchmark first, because the allocation is often not the bottleneck."

**Practical alternative:** `strings.Builder` (avoids the final copy when producing a string) and `bytes.Buffer` cover most cases without `unsafe`.

### The `slices` package

An interviewer who sees you hand-roll these will read it as pre-generics habits. Go 1.21 added the package.

- `slices.Clone(s)` is the correct fix for [the append gotcha](#the-classic-append-gotcha) and for [the huge backing array leak](#capacity-retention).
- `slices.Grow(s, n)` guarantees room for `n` more elements without reallocating. It is the clean way to preallocate on an existing slice.
- `slices.Delete`, `slices.Insert`, `slices.Compact`.
- `slices.Contains`, `slices.Index`, `slices.Equal`.
- `slices.Sort` (pattern-defeating quicksort), `slices.SortStableFunc`, `slices.BinarySearch`.
- `slices.Concat` (Go 1.22).

`slices.Sort` on ordered types is generally faster than `sort.Slice`, which pays an interface and reflection cost per comparison. This is an easy, defensible perf answer.

## Gotchas

### The classic append gotcha

```go
func process(items []int) {
    modified := items[:2]              // reslice, shares backing array
    modified = append(modified, 999)   // may or may not reallocate!
}

func main() {
    original := []int{1, 2, 3, 4, 5}
    process(original)
    fmt.Println(original) // becomes [1 2 999 4 5] — silent overwrite!
}
```

**Symptom:** unrelated data changed after `append`.

**Cause:** `append` allocates a **new** backing array only when the resulting length would exceed capacity, that is, when `len(s)+itemsAdded > cap(s)`. If there is spare capacity, `append` writes **into the existing backing array**. That silently overwrites memory another slice header still references elsewhere in the program. This is the classic source of "why did an unrelated field change" bugs when reslicing buffers for batching in a pipeline.

**Fix and rule of thumb:**

- Use the **three-index slice** `s[a:b:b]` to cap capacity at zero spare room. This forces a new allocation on the very next append.
- Or use `copy()` into a genuinely fresh slice, or `slices.Clone(s)`, if real isolation is needed.

The dangerous property is that the bug is capacity-sensitive. The result is deterministic for a given slice header, but the same-looking call may alias or allocate depending on the caller's spare capacity. That makes it a bug that passes unit tests and fails in production, which is why it is such a popular interview question. If asked "how would you catch it", the honest answer is API discipline (return a fresh slice, or document that the input is aliased), not testing.

### Capacity retention

There are two distinct leaks, both worth knowing.

**(a) Retaining a huge backing array via a tiny slice.**

```go
func firstLine(data []byte) []byte {
    i := bytes.IndexByte(data, '\n')
    return data[:i]   // 20-byte result, but pins the entire 50MB backing array
}
```

The returned header keeps the whole allocation alive, because the GC frees the _array_, not part of it. Fix: `return slices.Clone(data[:i])`, or an explicit `copy` into a right-sized slice. This is very real in log and protocol parsers that hold one small field out of a large read buffer.

**(b) Stale pointers in the tail after truncation.**

```go
s = s[:0]  // len is 0, but s[0:cap] still holds live pointers to every element
```

**Symptom:** a truncated slice still retains memory. For `[]T` where `T` contains pointers, truncating does **not** clear the slots beyond `len`, so those objects stay reachable and uncollectable. Fix when reusing a pooled buffer:

```go
clear(s)     // Go 1.21+ builtin: zeroes s[0:len(s)]
s = s[:0]
```

This is the standard bug in `sync.Pool`-backed slice reuse.

### nil vs empty slice

```go
var a []int  // nil slice: len=0, cap=0
b := []int{} // non-nil empty slice: len=0, cap=0
```

Both are safe to `append` and `range` over, but:

- `a == nil` is `true`.
- `b == nil` is `false`.

The language guarantees this observable distinction, not the empty slice's exact data pointer. `runtime.zerobase` and pointer equality for distinct zero-size objects are implementation details. The specification even permits pointers to distinct zero-size variables to compare equal or unequal.

**Symptom:** an API emits `null` instead of `[]`. A nil slice marshals to `null` in JSON and an empty slice marshals to `[]`. This is a common, subtle gotcha in API response payloads, for example mobile clients that crash on `null` where they expected an array. The fix in handler code is to initialize with `make([]T, 0)` rather than `var s []T`.

**Style guidance:** prefer `var s []T` as the zero value in general, because it is free. Reach for `[]T{}` only when the `null` vs `[]` distinction matters at a serialization boundary. Never test emptiness with `s == nil`; use `len(s) == 0`.

### Range loop gotchas

**The range expression is evaluated once.** The slice header is copied at loop start, so appending inside the loop does not extend the iteration:

```go
s := []int{1, 2, 3}
for i := range s {
    s = append(s, i)   // terminates — iterates exactly 3 times
}
```

**Loop variable semantics changed in Go 1.22.** Before 1.22, `i` and `v` were a _single_ variable reused across iterations, so this classic bug printed the last element three times:

```go
for _, v := range s {
    go func() { fmt.Println(v) }()   // pre-1.22: data race + all print last value
}
```

Since **Go 1.22** each iteration gets a fresh variable, so the code above is now correct. Be precise about this: if the interviewer expects the old answer, naming the version change is the stronger response. The behavior is governed by the `go` directive in `go.mod`, so an old module still gets the old semantics.

**`v` is a copy.** `for _, v := range structs { v.Field = x }` mutates nothing. Use `for i := range structs { structs[i].Field = x }`. For large structs the copy is also a real cost, and index-based iteration avoids it.

## Interview drills

- _"How would you avoid repeated reallocations in a hot path?"_ → `make([]T, 0, n)` or `slices.Grow`. See [growth factor](#growth-factor-on-reallocation).
- _"How is `copy()` implemented, and what does it cost?"_ → memmove vs typedslicecopy plus write barriers. See [what `copy()` costs](#what-copy-actually-costs).
- _"What's the cost of string to `[]byte` conversions?"_ → allocate and copy, with named compiler exceptions. See [converting between string and `[]byte`](#converting-between-string-and-byte).
- _"Why does my API sometimes return `null` instead of `[]`?"_ → nil vs empty slice. See [nil vs empty slice](#nil-vs-empty-slice).
- _"We pool buffers with `sync.Pool` and memory still grows."_ → stale tail pointers, `clear()`. See [capacity retention](#capacity-retention).
- _"Show me a slice bug that passes tests."_ → the aliasing append. See [the classic append gotcha](#the-classic-append-gotcha).

## Sources

- [Go language specification: slice types](https://go.dev/ref/spec#Slice_types)
- [`runtime/slice.go`](https://go.dev/src/runtime/slice.go)
- [`slices` package](https://pkg.go.dev/slices)
- [Go 1.26 compiler notes](https://go.dev/doc/go1.26)
