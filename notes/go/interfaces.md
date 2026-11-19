---
date: 2026-08-23
---

# Go Interfaces

> An interface value is a two-word pair: a type (or itab) word and a data pointer. It equals `nil` only when both words are nil, which is the source of the typed-nil trap. Method sets decide which concrete types satisfy an interface. Checked against Go 1.26.

## Questions this answers

- What is inside an interface value, and how does `eface` differ from `iface`?
- Why does my type not satisfy this interface?
- Does converting a value to an interface allocate?
- What does calling a method through an interface cost, and what can remove that cost?
- Why is `err != nil` true when I returned a nil pointer?
- When should I use interfaces and when generics?

## Notes

### Internal representation

**Caveat:** `eface`, `iface`, `itab`, direct-interface storage, and compiler devirtualization are implementation details. The language guarantees interface semantics, not these layouts. Re-check the runtime and compiler source when dating a low-level answer.

A Go interface value is a **two-word pair**, not a single pointer. There are two variants.

**`eface`** (empty interface, `interface{}` / `any`):

```go
type eface struct {
    _type *_type
    data  unsafe.Pointer
}
```

It holds just the concrete type and a pointer to the data. No method table is needed, because `any` has no methods to dispatch.

**`iface`** (interface with methods, for example `io.Writer` or `error`):

```go
type iface struct {
    tab  *itab
    data unsafe.Pointer
}
```

`any` has been a built-in alias for `interface{}` since Go 1.18. It is the identical type and purely a spelling change.

### The itab

```go
type itab struct {
    inter *interfacetype // the interface type (e.g. io.Writer)
    _type *_type         // the concrete type (e.g. *os.File)
    hash  uint32         // copy of _type.hash, for fast type switches
    _     [4]byte
    fun   [1]uintptr     // variable-length: method pointers, in interface method order
}
```

`fun` is declared as a one-element array but is actually variable-length, and the runtime indexes past the end. `fun[0] == 0` is the sentinel meaning "this type does **not** implement the interface", used by the comma-ok assertion path.

**Where itabs come from:** if both the interface and the concrete type are known at compile time, the linker emits the itab statically, at zero runtime cost. If the pairing is only discoverable at runtime (for example asserting one interface to another), the runtime builds it and caches it in a global hash table (`itabTable`), with lock-free reads on the hot path. So the _first_ such conversion is more expensive than later ones.

**Method dispatch cost:** calling a method through an interface is an indirect call through `fun[n]`. There are two consequences, and the second matters more:

1. The indirect call itself costs a few extra cycles and defeats branch prediction on polymorphic call sites.
2. **It blocks inlining**, and therefore blocks all the downstream optimizations that inlining enables (escape analysis, constant folding, bounds-check elimination). This is usually the dominant cost, not the jump.

**Devirtualization:** the compiler removes the indirection when it can prove the concrete type at the call site. Since **Go 1.21**, profile-guided optimization (PGO) also devirtualizes _hot_ indirect calls speculatively. It emits a type check plus an inlined direct call, with the indirect call as the fallback. This is a good answer to "how would you speed up an interface-heavy hot path without rewriting it": enable PGO before restructuring code.

### Method sets

The rule:

| Type | Method set includes                    |
| ---- | -------------------------------------- |
| `T`  | methods with receiver `T` only         |
| `*T` | methods with receiver `T` **and** `*T` |

So a `T` **value** does not satisfy an interface whose methods are implemented with pointer receivers:

```go
type Counter struct{ n int }
func (c *Counter) Inc() { c.n++ }   // pointer receiver

type Incrementer interface{ Inc() }

var i Incrementer = Counter{}    // compile error: method has pointer receiver
var j Incrementer = &Counter{}   // fine
```

**Why the asymmetry?** Given a `*T` you can always dereference to get a `T`, so `*T` can satisfy everything. Given a `T` stored _inside an interface_, you cannot take its address, because the interface holds an unaddressable copy. Pointer-receiver methods, which need to mutate the original, have nothing valid to point at. Go refuses rather than silently mutating a copy.

**The confusing part**, and the reason this trips people up: outside interfaces, `c.Inc()` on an addressable variable `c` compiles fine, because the compiler inserts `(&c).Inc()` for you. That sugar exists for direct calls only, **not** for interface satisfaction. So the same expression works in one context and fails in another.

**Practical rules:**

- Do not mix receiver kinds on one type. Pick pointer receivers if any method mutates, if the struct is large, or if it contains a `sync.Mutex` (a value receiver copies the mutex, and `go vet` flags this).
- Values in maps are unaddressable: `m["k"].Inc()` will not compile for pointer receivers. Use `map[string]*T`.
- Loop variables in `range` are copies, so calling a mutating method on them does nothing useful.

### Boxing and allocation

The `data` word is a **pointer**. So storing a non-pointer value in an interface generally requires the value to live somewhere addressable, which means it escapes to the heap:

```go
var x any = 42          // conversion may allocate
var y any = &someStruct // no allocation — already a pointer
```

Values that are already **pointer-shaped** (pointers, maps, channels, funcs, and single-pointer structs) are stored directly in the data word with no allocation.

Runtime optimizations that avoid the allocation:

- **Small integers:** runtime conversions can reuse `runtime.staticuint64s` for values 0 to 255. Do not infer that every larger literal allocates, because constants and non-escaping conversions may live in static data or on the stack. Measure the actual expression.
- **Zero-size types** (`struct{}`) point at `runtime.zerobase`.
- **Constants and read-only values** that the compiler can place in static data.
- If the interface value provably does not escape, escape analysis keeps the backing value on the stack. See [Go Escape Analysis and GC Tuning](escape-analysis-gc-tuning.md).

**Where this bites in production:** logging and `fmt`. Every `fmt.Sprintf("%d", n)` boxes its arguments into `[]any`, so hot-path structured logging is a classic source of surprise allocations. This is why the typed APIs of `zerolog` and `zap` (`.Int("n", n)`) exist: they avoid the `any` box. It is a concrete, credible perf answer.

Verify with `go build -gcflags='-m'`, or with `-benchmem` in benchmarks.

### Type assertions and type switches

```go
v, ok := i.(*Concrete)   // concrete type: compare the type word — a pointer compare, very cheap
w, ok := i.(io.Writer)   // interface type: needs an itab; static if known, else runtime lookup + cache
```

- Asserting to a **concrete** type is essentially one pointer comparison.
- Asserting to an **interface** type must find or build the itab. It is static when the compiler can resolve it. Otherwise it is a hash lookup in `itabTable`, cached after the first time.
- The single-return form `v := i.(T)` **panics** on mismatch, and the comma-ok form does not. Prefer comma-ok anywhere the type is not guaranteed.
- **Type switches** compile to a sequence of comparisons on the type hash, and the compiler builds a jump table when there are many cases. Case order rarely matters for performance. It does matter for correctness: put specific interfaces before general ones, because the first match wins.

### Interfaces vs generics

This is sometimes asked as "shouldn't you just use generics for performance?" See [Go Generics](generics.md#gcshape-stenciling-and-dictionaries) for the implementation.

Generics are implemented with **GC shape stenciling**: the compiler generates one instantiation per _memory layout_ class (all pointer types share one shape) and passes a hidden **dictionary** carrying type-specific information. So:

- Generics avoid **boxing**. A `[]T` stays a `[]T`, with no interface header per element. That is the real win, especially for containers.
- Method calls on a type parameter may still be **indirect**, dispatched via the dictionary. So generics are not automatically faster than interfaces for dispatch-heavy code.
- Rule of thumb: use generics for **data structures and algorithms** over concrete types, and interfaces for **behavioural polymorphism and dependency inversion**. Do not rewrite an interface hierarchy into generics expecting free speed. Benchmark it.

## Gotchas

### The nil-pointer trap

**Symptom:** `err != nil` is true after returning a typed nil.

**The core issue:** a truly nil interface has _both_ words nil (`tab/_type = nil`, `data = nil`). An interface holding a **nil pointer of a concrete type** has a non-nil type/itab word, and only `data` is nil. Since `i == nil` requires _both_ words to be nil, this interface is **not equal to nil**, even though the underlying pointer is nil.

**Classic example:**

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

**Why:** returning `err` (a `*MyError`, currently nil) as `error` constructs `{tab: &itab{...*MyError...}, data: nil}`. The type word is set, so the interface is non-nil, and the nil check passes even though the intent was "no error".

**Fix and rule of thumb:** never return a typed nil pointer as an interface value if the caller will nil-check the interface. Declare the variable as the _interface_ type, or return a literal `nil`:

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

**Where it actually shows up in real code** (better than the toy example if you get asked): a named return value of a concrete error type, or a struct field of type `*MyError` returned through an `error`-typed method. Also, `errors.Is(err, nil)` will not save you here, because the interface genuinely is not nil.

### Other interface gotchas

- **Printing a nil pointer inside an interface:** `fmt.Println(err)` may print `<nil>` (if `Error()` handles a nil receiver gracefully) or **panic** if `Error()` dereferences fields without a nil check. This is a good code-review question. A nil receiver is perfectly legal in Go: methods can be called on nil pointers, and only dereferencing fails.
- **Interface equality (`i1 == i2`):** compares _both_ the type and data words. Equal values of different concrete types (`int32(5)` vs `int64(5)`) are **not equal**, because the type is part of the comparison.
- **Uncomparable types inside interfaces** (slices, maps, funcs): comparing such interfaces with `==` **panics at runtime**, not at compile time, since the compiler cannot always know the concrete type statically. This is a subtle panic source in generic and interface-heavy code. It is also a real hazard when such a value is used as a **map key**, where the panic surfaces on insertion.
- **Embedding a nil interface** in a struct and calling through it panics with a nil dereference, not a helpful message.

## Interview drills

- _"What's in an interface value?"_ → two words, eface vs iface, itab contents. See [internal representation](#internal-representation) and [the itab](#the-itab).
- _"Why doesn't my type satisfy this interface?"_ → method sets, pointer receiver. See [method sets](#method-sets).
- _"Does `var x any = 42` allocate?"_ → not necessarily. Distinguish runtime boxing, static constants, `staticuint64s`, and escape analysis. See [boxing and allocation](#boxing-and-allocation).
- _"How does polymorphism cost anything in Go?"_ → an indirect call, but _inlining loss_ is the bigger cost. Mention PGO devirtualization. See [the itab](#the-itab).
- _"Why is `err != nil` true when I returned nil?"_ → see [the nil-pointer trap](#the-nil-pointer-trap).
- _"How would you detect that bug in review or a test?"_ → analyzers such as `nilness` (from `golang.org/x/tools`, available through `gopls` and `golangci-lint`) catch some static patterns. More reliably, write a table-driven test that asserts on the returned **interface** (not the concrete type). The durable fix is API discipline: never declare a concrete error type as a function's return type.

## Sources

- [Go language specification: interface types](https://go.dev/ref/spec#Interface_types)
- [`runtime/iface.go`](https://go.dev/src/runtime/iface.go)
- [Go compiler PGO documentation](https://go.dev/doc/pgo)
