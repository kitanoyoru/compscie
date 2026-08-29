# Go Interfaces — Internal Representation & Nil-Pointer Trap

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b1a407e452d812db75ff1719017ff9c)

Notes from interview prep session. Continuation of Day 1 core-language-internals prep (see "Go Scheduler (GMP) — Interview Prep Notes" for the companion doc).

> ✅ Reviewed and expanded. Accurate as of **Go 1.26**. Fixed: struct definitions were tagged as JavaScript code blocks. Added: full `itab` layout and runtime caching (§2), **method sets** (§3) — the single most common follow-up to the nil trap, boxing/allocation behaviour (§4), and type assertion cost (§5).

> ⚠️ `eface`, `iface`, `itab`, direct-interface storage, and compiler devirtualization are implementation details. The language guarantees interface semantics, not these layouts; re-check runtime/compiler source when dating a low-level answer.

## 1. Interface Internal Representation

A Go interface value is a **two-word pair**, not a single pointer. Two variants:

**`eface`** (empty interface, `interface{}` / `any`):

```go
type eface struct {
    _type *_type
    data  unsafe.Pointer
}
```

Just the concrete type and a pointer to the data. No method table needed since `any` has no methods to dispatch.

**`iface`** (interface with methods, e.g. `io.Writer`, `error`):

```go
type iface struct {
    tab  *itab
    data unsafe.Pointer
}
```

(`any` has been a built-in alias for `interface{}` since Go 1.18 — identical type, purely spelling.)

## 2. The itab

```go
type itab struct {
    inter *interfacetype // the interface type (e.g. io.Writer)
    _type *_type         // the concrete type (e.g. *os.File)
    hash  uint32         // copy of _type.hash, for fast type switches
    _     [4]byte
    fun   [1]uintptr     // variable-length: method pointers, in interface method order
}
```

`fun` is declared as a 1-element array but is actually variable-length — the runtime indexes past the end. `fun[0] == 0` is the sentinel meaning "this type does **not** implement the interface", used by the comma-ok assertion path.

**Where itabs come from:** if both the interface and concrete type are known at compile time, the linker emits the itab statically — zero runtime cost. If the pairing is only discoverable at runtime (e.g. asserting one interface to another), the runtime builds it and caches it in a global hash table (`itabTable`), with lock-free reads on the hot path. So the _first_ such conversion is more expensive than subsequent ones.

**Method dispatch cost:** calling a method through an interface is an indirect call through `fun[n]`. Two consequences, and the second matters more:

1. The indirect call itself costs a few extra cycles and defeats branch prediction on polymorphic call sites.
2. **It blocks inlining** — and therefore blocks all the downstream optimizations inlining enables (escape analysis, constant folding, bounds-check elimination). This is usually the dominant cost, not the jump.

**Devirtualization:** the compiler removes the indirection when it can prove the concrete type at the call site. Since **Go 1.21**, profile-guided optimization (PGO) also devirtualizes _hot_ indirect calls speculatively — it emits a type check plus an inlined direct call, with the indirect call as fallback. Good answer to "how would you speed up an interface-heavy hot path without rewriting it": enable PGO before restructuring code.

## 3. Method Sets — Value vs Pointer Receivers

The rule:

| Type | Method set includes                    |
| ---- | -------------------------------------- |
| `T`  | methods with receiver `T` only         |
| `*T` | methods with receiver `T` **and** `*T` |

So a `T` **value** does not satisfy an interface whose implementation uses pointer receivers:

```go
type Counter struct{ n int }
func (c *Counter) Inc() { c.n++ }   // pointer receiver

type Incrementer interface{ Inc() }

var i Incrementer = Counter{}    // compile error: method has pointer receiver
var j Incrementer = &Counter{}   // fine
```

**Why the asymmetry?** Given a `*T` you can always dereference to get a `T`, so `*T` can satisfy everything. Given a `T` stored _inside an interface_, you cannot take its address — the interface holds an unaddressable copy — so pointer-receiver methods, which need to mutate the original, have nothing valid to point at. Go refuses rather than silently mutating a copy.

**The confusing part** (and the reason this trips people up): outside interfaces, `c.Inc()` on an addressable variable `c` compiles fine, because the compiler inserts `(&c).Inc()` for you. That sugar exists for direct calls only, **not** for interface satisfaction. So the same expression "works" in one context and fails in another.

**Practical rules:**

- Don't mix receiver kinds on one type. Pick pointer receivers if any method mutates, or if the struct is large, or if it contains a `sync.Mutex` (a value receiver copies the mutex — `go vet` flags this).
- Values in maps are unaddressable: `m["k"].Inc()` won't compile for pointer receivers. Use `map[string]*T`.
- Loop variables in `range` are copies, so calling a mutating method on them does nothing useful.

## 4. Boxing — When Interface Conversion Allocates

The `data` word is a **pointer**. So storing a non-pointer value in an interface generally requires the value to live somewhere addressable, i.e. it escapes to the heap:

```go
var x any = 42          // conversion may allocate
var y any = &someStruct // no allocation — already a pointer
```

Values that are already **pointer-shaped** (pointers, maps, channels, funcs, and single-pointer structs) are stored directly in the data word with no allocation.

Runtime optimizations that avoid the allocation:

- **Small integers:** runtime conversions can reuse `runtime.staticuint64s` for values 0–255. Do not infer that every larger literal allocates: constants and non-escaping conversions may live in static data or on the stack. Measure the actual expression.
- **Zero-size types** (`struct{}`) point at `runtime.zerobase`.
- **Constants and read-only values** the compiler can place in static data.
- If the interface value provably doesn't escape, escape analysis keeps the backing value on the stack.

**Where this bites in production:** logging and `fmt`. Every `fmt.Sprintf("%d", n)` boxes its arguments into `[]any`; hot-path structured logging is a classic source of surprise allocations. This is why `zerolog`/`zap`'s typed APIs (`.Int("n", n)`) exist — they avoid the `any` box. Concrete, credible perf answer.

Verify with `go build -gcflags='-m'` or `-benchmem` in benchmarks.

## 5. Type Assertions and Type Switches

```go
v, ok := i.(*Concrete)   // concrete type: compare the type word — a pointer compare, very cheap
w, ok := i.(io.Writer)   // interface type: needs an itab; static if known, else runtime lookup + cache
```

- Asserting to a **concrete** type is essentially one pointer comparison.
- Asserting to an **interface** type must find or build the itab. Static when the compiler can resolve it; otherwise a hash lookup in `itabTable` (cached after the first time).
- The single-return form `v := i.(T)` **panics** on mismatch; the comma-ok form does not. Prefer comma-ok anywhere the type isn't guaranteed.
- **Type switches** compile to a sequence of comparisons on the type hash, and the compiler builds a jump table when there are many cases. Ordering rarely matters for performance; correctness ordering does (put specific interfaces before general ones — the first match wins).

## 6. The Nil-Pointer Trap

**The core issue:** a truly nil interface has _both_ words nil (`tab/_type = nil`, `data = nil`). But an interface holding a **nil pointer of a concrete type** has a non-nil type/itab word — only `data` is nil. Since `i == nil` requires _both_ words to be nil, this interface is **NOT equal to nil**, even though the underlying pointer is nil.

**Classic trap example:**

```go
type MyError struct{ msg string }
func (e *MyError) Error() string { return e.msg }

func doSomething() error {
    var err *MyError // nil pointer, zero value
    // ... logic that doesn't set err ...
    return err // returns nil *MyError wrapped in a NON-nil error interface
}

func main() {
    err := doSomething()
    if err != nil {
        fmt.Println("got an error!") // prints! surprising — err is non-nil interface
    }
}
```

**Why:** returning `err` (a `*MyError`, currently nil) as `error` constructs `{tab: &itab{...*MyError...}, data: nil}`. Type word is set → interface is non-nil → nil check passes even though intent was "no error."

**Fix / rule of thumb:** never return a typed nil pointer as an interface value if the caller will nil-check the interface. Declare the variable as the _interface_ type, or return a literal `nil`:

```go
func doSomething() error {
    var err *MyError
    if somethingBad {
        err = &MyError{msg: "bad"}
    }
    if err != nil {
        return err
    }
    return nil // literal nil → truly nil interface, both words unset
}
```

**Where it actually shows up in real code** (better than the toy example if you get asked): a named return value of a concrete error type, or a struct field of type `*MyError` returned through an `error`-typed method. Also `errors.Is(err, nil)` will not save you here — the interface genuinely isn't nil.

## 7. Related Gotchas

- **Printing a nil-pointer-in-interface:** `fmt.Println(err)` may print `<nil>` (if `Error()` handles a nil receiver gracefully) or **panic** if `Error()` dereferences fields without a nil check. Good code-review question. Note a nil receiver is perfectly legal in Go — methods can be called on nil pointers; only dereferencing fails.
- **Interface equality (`i1 == i2`):** compares _both_ type and data words. Equal values of different concrete types (`int32(5)` vs `int64(5)`) are **not equal** — type is part of the comparison.
- **Uncomparable types inside interfaces** (slices, maps, funcs): comparing such interfaces with `==` **panics at runtime**, not a compile error, since the compiler can't always know the concrete type statically. Subtle panic source in generic/interface-heavy code — and a real hazard when such a value is used as a **map key**, where the panic surfaces on insertion.
- **Embedding a nil interface** in a struct and calling through it panics with a nil dereference, not a helpful message.

## 8. Interfaces vs Generics (Go 1.18+)

Sometimes asked as "shouldn't you just use generics for performance?"

Generics are implemented with **GC shape stenciling**: the compiler generates one instantiation per _memory layout_ class (all pointer types share one shape), and passes a hidden **dictionary** carrying type-specific information. So:

- Generics avoid **boxing** — a `[]T` stays a `[]T`, no interface header per element. That's the real win, especially for containers.
- But method calls on a type parameter may still be **indirect**, dispatched via the dictionary. So generics are not automatically faster than interfaces for dispatch-heavy code.
- Rule of thumb: generics for **data structures and algorithms** over concrete types; interfaces for **behavioural polymorphism and dependency inversion**. Do not rewrite an interface hierarchy into generics expecting free speed — benchmark it.

## 9. Interview Drills

- _"What's in an interface value?"_ → two words, eface vs iface, itab contents (§1, §2)
- _"Why doesn't my type satisfy this interface?"_ → method sets, pointer receiver (§3)
- _"Does `var x any = 42` allocate?"_ → not necessarily; distinguish runtime boxing, static constants, `staticuint64s`, and escape analysis (§4)
- _"How does polymorphism cost anything in Go?"_ → indirect call, but _inlining loss_ is the bigger cost; mention PGO devirtualization (§2)
- _"Why is `err != nil` true when I returned nil?"_ → §6
- _"How would you detect that bug in review or a test?"_ → `go vet` / `staticcheck` `nilness` catches some static patterns; more reliably, a table-driven test asserting on the returned **interface** (not the concrete type). The durable fix is API discipline: never declare a concrete error type as a return value.

## Official Sources

- [Go language specification: interface types](https://go.dev/ref/spec#Interface_types)
- [`runtime/iface.go`](https://go.dev/src/runtime/iface.go)
- [Go compiler PGO documentation](https://go.dev/doc/pgo)
