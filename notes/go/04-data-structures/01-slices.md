# Go Slices — Internals, Aliasing, and Growth

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b1a407e452d81d18889fc338e5ae258)

Notes from interview prep session. Continuation of Day 1 core-language-internals prep (companion docs: "Go Scheduler (GMP)" and "Go Interfaces").

> ✅ Reviewed and expanded. Accurate as of **Go 1.26**. The two items previously flagged as "not yet covered" — `copy()` cost and string ↔ `[]byte` conversion — are now written up in §7 and §8. New: capacity-retention memory leaks (§5), the `slices` package (§9), and range-loop gotchas (§10).

## 1. Slice Header Structure

A slice is a small header struct, not the data itself:

```go
type sliceHeader struct {
    ptr *T   // pointer to first element in the backing array
    len int  // number of elements currently accessible
    cap int  // number of elements the backing array can hold from ptr onward
}
```

24 bytes on 64-bit (pointer + 2 ints). This header is copied when passed to a function — the **backing array is not copied**. This is why slices act like reference types for mutation but value types for length/cap changes.

**Consequence worth stating explicitly:** a function that only _mutates elements_ needs no pointer; a function that `append`s and wants the caller to see the result must either return the slice or take a `*[]T`. This is the whole reason `append` returns a value.

## 2. Backing Array Aliasing

Re-slicing (`a := s[1:3]`, `b := s[2:5]`) creates new headers that point into the **same underlying backing array**, just at different offsets/lengths. Writing through one slice is visible through any other slice whose range overlaps in the shared backing array. E.g. `a[1] = 99` also changes `b[0]` if their ranges overlap on the same backing array.

**Bounds detail:** `s[low:high]` may extend `high` up to `cap(s)`, not just `len(s)`. So a slice can be re-grown into capacity it can't currently "see" — which is exactly the mechanism behind §3.

## 3. The Classic Append Gotcha

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

**Why it's dangerous:** `append` allocates a **new** backing array when the resulting length would exceed capacity: `len(s)+itemsAdded > cap(s)`. If there's spare capacity, `append` writes **into the existing backing array**, silently overwriting memory another slice header still references elsewhere in the program. Classic source of "why did an unrelated field change" bugs when reslicing buffers for batching in a pipeline.

**Fix / rule of thumb:**

- Use the **three-index slice** `s[a:b:b]` to cap capacity to zero spare room — forces a new allocation on the very next append.
- Or `copy()` into a genuinely fresh slice / `slices.Clone(s)` if real isolation is needed.

**The dangerous property is that it's capacity-sensitive.** The result is deterministic for a given slice header, but the same-looking call may alias or allocate depending on the caller's spare capacity. This makes it a bug that passes unit tests and fails in production, which is why it's such a popular interview question. If asked "how would you catch it," the honest answer is: API discipline (return a fresh slice, or document that the input is aliased), not testing.

## 4. Growth Factor on Reallocation

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
- **Since Go 1.18**: past approx. 256 elements, growth transitions toward roughly **1.25x**. Note the formula is a _smooth_ transition, not a hard cliff — pre-1.18 the threshold was 1024 with an abrupt 2x → 1.25x jump, which caused visible allocation-size discontinuities.
- Then the result is **rounded up to an allocator size class** (see the memory allocator: 8, 16, 32, 48, 64, 80... bytes). So actual `cap()` after growth often isn't a clean number — asking `cap()` after appending 1 element to an empty `[]int` gives 1, then 2, 4, 8... but for odd element sizes the rounding is visible.

**Perf story for high-throughput code:** preallocate with `make([]T, 0, expectedSize)` when the approximate final size is known (e.g. batching Kafka messages before a flush) — avoids N reallocations + N copies as the batch grows. Growing a slice from 0 to N by appending is O(N) total copying and gives amortized O(1) append. The exact number of allocations and copied elements depends on the runtime growth algorithm, element size, and allocator size-class rounding; it should not be summarized as a stable `2N` constant.

**Go 1.26 note:** the compiler now stack-allocates slice backing stores in more situations than before, so some previously heap-allocating hot paths got free wins on upgrade. Escape analysis still decides — check with `go build -gcflags='-m'`.

## 5. Capacity Retention — the Slice Memory Leak

Two distinct leaks, both worth knowing:

**(a) Retaining a huge backing array via a tiny slice.**

```go
func firstLine(data []byte) []byte {
    i := bytes.IndexByte(data, '\n')
    return data[:i]   // 20-byte result, but pins the entire 50MB backing array
}
```

The returned header keeps the whole allocation alive — the GC frees the _array_, not part of it. Fix: `return slices.Clone(data[:i])` or an explicit `copy` into a right-sized slice. Very real in log/protocol parsers holding one small field out of a large read buffer.

**(b) Stale pointers in the tail after truncation.**

```go
s = s[:0]  // len is 0, but s[0:cap] still holds live pointers to every element
```

For `[]T` where T contains pointers, truncating does **not** clear the slots beyond `len`, so those objects stay reachable and uncollectable. Fix when reusing a pooled buffer:

```go
clear(s)     // Go 1.21+ builtin: zeroes s[0:len(s)]
s = s[:0]
```

This is the standard bug in `sync.Pool`-backed slice reuse.

## 6. nil Slice vs Empty Slice

```go
var a []int  // nil slice: len=0, cap=0
b := []int{} // non-nil empty slice: len=0, cap=0
```

Both are safe to `append` and `range` over, but:

- `a == nil` → `true`
- `b == nil` → `false`

The language guarantees this observable distinction, not the empty slice's exact data pointer. `runtime.zerobase` and pointer equality for distinct zero-size objects are implementation details; the specification even permits pointers to distinct zero-size variables to compare equal or unequal.

**Real-world relevance:** JSON marshaling difference — a nil slice marshals to `null`, an empty slice marshals to `[]`. Common, subtle gotcha in API response payloads (mobile clients that crash on `null` where they expected an array). The fix in handler code is to initialize with `make([]T, 0)` rather than `var s []T`.

**Style guidance:** prefer `var s []T` as the zero value in general (it's free), and only reach for `[]T{}` when the `null` vs `[]` distinction actually matters at a serialization boundary. Never test emptiness with `s == nil` — use `len(s) == 0`.

### Why slices are not comparable

A slice header is an implementation model, not the slice's value semantics. Comparing only `(ptr, len, cap)` would ask "are these two views identical?", not "do these sequences contain equal elements?" Two different backing arrays can contain the same values, while two headers sharing an array can expose different ranges. Element-wise equality would also make `==` potentially O(n), could panic for non-comparable element types, and would make slices unusable as stable map keys because their elements are mutable.

Therefore slices are comparable only to `nil`. For contents, use `slices.Equal` or `slices.EqualFunc`; for identity/aliasing questions, make that intent explicit rather than treating the header as language-level equality.

## 7. What `copy()` Actually Costs

_(Previously flagged as unexplored.)_

`copy(dst, src)` copies `min(len(dst), len(src))` elements and returns that count. It's a **builtin, not a library function** — the compiler lowers it directly:

- For pointer-free element types → `runtime.memmove`, i.e. an optimized, architecture-specific block move (SSE/AVX on amd64). Handles overlapping ranges correctly, unlike C's `memcpy`.
- For element types **containing pointers** → `runtime.typedslicecopy`, which is memmove **plus write barriers** for the GC. Measurably more expensive during an active GC mark phase.

**Cost model:** O(n) in bytes, but with a very low constant — usually bandwidth-bound rather than instruction-bound. The practical implication: copying a `[]byte` is cheap; copying a `[]*Foo` or `[]SomeStructWithPointers` of the same byte size is _not_ equally cheap, because of barrier work. If you're optimizing a hot path, prefer pointer-free element types.

**Special case:** `copy(dstBytes, srcString)` is legal — the one place the type rules bend, so you can copy a string into a `[]byte` without a conversion allocation.

Note `copy` does **not** grow `dst`. `copy(make([]int, 0, 10), src)` copies **zero** elements — a classic bug. Use `make([]int, len(src))`.

## 8. String ↔ \[\]byte Conversion Cost

_(Previously flagged as unexplored.)_

Strings are immutable; `[]byte` is not. So in general **both directions allocate and copy** — `[]byte(s)` and `string(b)` are O(n) with a heap allocation, because the runtime must guarantee that later mutation of the `[]byte` can't be observed through the string.

The compiler optimizes several important cases into **zero-allocation**:

| Pattern                          | Allocates? | Why                                 |
| -------------------------------- | ---------- | ----------------------------------- |
| `m[string(b)]` (map lookup)      | **No**     | Temp string can't escape the lookup |
| `string(b) == "literal"`         | **No**     | Comparison only                     |
| `for i, r := range string(b)`    | **No**     | Iteration only                      |
| `switch string(b) { ... }`       | **No**     | Comparison only                     |
| `s := string(b)` stored/returned | **Yes**    | Escapes; must own its bytes         |
| `[]byte(s)` then mutated         | **Yes**    | Must not alias the string           |

Short strings (up to 32 bytes) may use a small stack buffer instead of the heap when the compiler proves non-escape.

**The unsafe escape hatch** (Go 1.20+, the _supported_ form — do not use the old `reflect.StringHeader` casts):

```go
func unsafeString(b []byte) string {
    return unsafe.String(unsafe.SliceData(b), len(b))
}
func unsafeBytes(s string) []byte {
    return unsafe.Slice(unsafe.StringData(s), len(s))
}
```

**Contract:** the resulting string must be treated as valid only while the backing bytes are unmodified, and the `[]byte` from a string must **never** be written to (string data may live in read-only memory — writing segfaults). Legitimate in hot paths where you control both sides; a landmine anywhere else. Realistic answer if an interviewer asks: "I'd reach for this only inside a tight, well-tested internal decoder, and I'd benchmark first — the allocation is often not the bottleneck."

**Practical alternative:** `strings.Builder` (avoids the final copy when producing a string) and `bytes.Buffer` cover most cases without unsafe.

## 9. The `slices` Package (Go 1.21+)

Worth naming — an interviewer noticing you still hand-roll these will read it as pre-generics habits.

- `slices.Clone(s)` — the correct fix for §3 and §5(a)
- `slices.Grow(s, n)` — guarantees room for `n` more without reallocating; the clean way to preallocate on an existing slice
- `slices.Delete`, `slices.Insert`, `slices.Compact`
- `slices.Contains`, `slices.Index`, `slices.Equal`
- `slices.Sort` (pattern-defeating quicksort), `slices.SortStableFunc`, `slices.BinarySearch`
- `slices.Concat` (Go 1.22)

`slices.Sort` on ordered types is generally faster than `sort.Slice`, which pays an interface + reflection cost per comparison. Easy, defensible perf answer.

## 10. Range Loop Gotchas

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

Since **Go 1.22** each iteration gets a fresh variable, so the above is now correct. Worth stating precisely — if the interviewer expects the old answer, naming the version change is the stronger response. (Governed by the `go` directive in `go.mod`, so an old module still gets old semantics.)

**`v` is a copy.** `for _, v := range structs { v.Field = x }` mutates nothing. Use `for i := range structs { structs[i].Field = x }`. For large structs the copy is also a real cost — index-based iteration avoids it.

## 11. Interview Drills

- _"How would you avoid repeated reallocations in a hot path?"_ → `make([]T, 0, n)` or `slices.Grow` (§4)
- _"How is `copy()` implemented / what does it cost?"_ → memmove vs typedslicecopy + write barriers (§7)
- _"What's the cost of string ↔ \[\]byte conversions?"_ → allocate + copy, with named compiler exceptions (§8)
- _"Why does my API sometimes return `null` instead of `[]`?"_ → nil vs empty slice (§6)
- _"We pool buffers with sync.Pool and memory still grows"_ → stale tail pointers, `clear()` (§5b)
- _"Show me a slice bug that passes tests"_ → the aliasing append (§3)

## Official Sources

- [Go language specification: slice types](https://go.dev/ref/spec#Slice_types)
- [`runtime/slice.go`](https://go.dev/src/runtime/slice.go)
- [`slices` package](https://pkg.go.dev/slices)
- [Go 1.26 compiler notes](https://go.dev/doc/go1.26)
