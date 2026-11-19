---
date: 2026-08-23
---

# Go Generics

> Generics add type parameters constrained by interfaces, with inference filling in the concrete types at most call sites. The language guarantees constraints and inference. GCShape stenciling and dictionaries are compiler implementation details. Checked against Go 1.26.

## Questions this answers

- How do constraints work, and what does `~` mean?
- When must I instantiate a generic function explicitly?
- How does Go implement generics compared with C++ and Java?
- What is a GCShape, and why can `*Foo` and `*Bar` share compiled code?
- What can generics not do?
- When should I use interfaces instead?

## Notes

### Syntax basics

```go
func Map[T, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}

type Set[T comparable] map[T]struct{}
```

`T` and `U` are type parameters, constrained by an interface (`any` means no constraint, and `comparable` means the type supports `==` and `!=`). Type inference usually determines the concrete types from function arguments. Explicit instantiation (`Map[int, string](...)`) is only needed when a type parameter appears solely in the return type, with nothing to infer from.

### Constraints

A constraint is an interface, extended with special generics syntax:

```go
type Number interface {
    ~int | ~int32 | ~int64 | ~float32 | ~float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}
```

**The `~` (tilde) detail:** `~int` means "any type whose _underlying type_ is `int`", not just `int` itself. Without the tilde, a custom type like `type UserID int` would **not** satisfy the constraint even though it behaves like an int. With `~int`, it does.

**`comparable`** is a built-in constraint (not library-based) meaning the type supports `==` and `!=`. Structs containing slices, maps, or funcs do not satisfy it. This is the same restriction covered under [interface equality panics](interfaces.md#other-interface-gotchas).

### GCShape stenciling and dictionaries

**Caveat:** GC shapes, dictionaries, layouts, and calling conventions are compiler implementation details, not Go language guarantees. Use them for performance reasoning, but re-check the compiler source and design when version precision matters.

There are three approaches a language could take for generics:

- **C++ templates:** full **monomorphization**, a separate compiled copy of the function per distinct type instantiation. This is fastest at runtime and can bloat binary size.
- **Java generics:** **type erasure**, one compiled version where type parameters are erased and everything goes through `Object` references (boxing primitives, dynamic casts). Binaries are small, with a real runtime cost from boxing and indirection.
- **Go:** a hybrid called **GCShape stenciling**.

**The precise GCShape rule (from Go's official design doc):** two concrete types share a GCShape if and only if they have the same underlying type, or they are both pointer types. So `*Foo` and `*Bar` share a shape purely by both being pointers, regardless of what they point to. Meanwhile `int` and `int32` are kept in **separate** shapes despite both being small non-pointer values, because their actual instructions differ (for example, shift operations behave differently at different widths).

**Types sharing a GCShape compile to one shared machine-code instantiation.** Types with distinct GCShapes each get their own separately compiled version, which is essentially free and the same as hand-written non-generic code.

### The dictionary

For shared-shape instantiations, the compiler passes a hidden **dictionary** parameter at each call site so the shared code can still behave correctly per concrete type.

**Key fact:** the dictionary is **not** a single fixed struct type. Because it is entirely compile-time and read-only, it does not need to follow any particular structure. It is just an array of bytes, and the compiler assigns meaning to each field as needed, tailored per call site to exactly what that function body requires.

Conceptually it is built from:

1. **A `*runtime._type` reference for each instantiated type parameter** (T1, T2, ...), used for stack traceback printing, computing sizes, and converting to `interface{}`.
2. **Resolved method pointers** for any method the constraint requires. If `T` must satisfy a constraint with a method, the dictionary carries the concrete function pointer for that specific type's implementation.
3. **itab-equivalent entries** for converting a type parameter's value into an interface, when the generic code does that internally.
4. **Sub-dictionaries.** If the generic function calls another generic function using its own type parameters, it constructs and passes a nested dictionary for that inner call.

Mechanically, the dictionary is an extra hidden argument to shared-shape code. Its register or stack placement is architecture- and compiler-version-specific and should not be memorized as a portable rule.

### Performance implications

- **Non-shared shapes** (for example `int` and `float64`): a fully specialized compiled version, essentially free and the same as hand-written code.
- **Shared shapes going through the dictionary:** a small overhead versus true monomorphization. Some operations (for example calling a method through the dictionary) go through an extra indirection rather than a direct static call.
- Generics often avoid interface boxing and type assertions in containers, but that does not guarantee fewer heap allocations. Escape analysis, inlining, dictionary dispatch, and the concrete operation still determine the result. Benchmark and inspect `-gcflags='-m'` for a hot path.

### Go 1.26 language additions

Go 1.26 allows `new(expression)`, not only `new(Type)`. This makes an optional pointer from an inferred expression concise:

```go
p := new(computeValue()) // *T pointing to the evaluated result
```

Generic types may also refer to themselves in their own type-parameter list, enabling recursive constraints such as:

```go
type Adder[A Adder[A]] interface {
    Add(A) A
}
```

These are language changes. Unlike the GCShape details, they are portable guarantees for modules targeting Go 1.26 or newer.

### Patterns to write live

```go
// Generic Min/Max using the standard-library cmp.Ordered
func Max[T cmp.Ordered](a, b T) T {
    if a > b { return a }
    return b
}

// Generic Set via comparable
type Set[T comparable] map[T]struct{}
func (s Set[T]) Add(v T) { s[v] = struct{}{} }
func (s Set[T]) Has(v T) bool { _, ok := s[v]; return ok }
```

## Gotchas

### No type parameters on methods

A method can use its receiver type's parameters but cannot introduce fresh ones:

```go
type List[T any] struct{ items []T }
func (l List[T]) Map[U any](f func(T) U) List[U] { ... } // NOT allowed
```

This is a genuine language limitation. The common workaround is a free function instead of a method, like `Map` in [syntax basics](#syntax-basics).

### Type inference gaps

If a type parameter appears **only** in the return type, the compiler often cannot infer it. This requires explicit instantiation: `Zero[int]()`.

## Interview drills

- _"Why is it safe for `*Foo` and `*Bar` to share a shape, given they point to totally different types?"_ → The shared compiled code only ever needs to dereference, copy, or hand the pointer to the GC as "trace this word as a pointer", and none of that cares what is on the other end. Anything that does need to know the pointed-to type (calling a method, computing element size) goes through the dictionary instead of being baked into the shared machine code. See [the dictionary](#the-dictionary).
- _"When would you deliberately not use generics?"_ → When a simple `interface{ Method() }`-based polymorphic design already captures the need cleanly and the type set is naturally small and fixed. Generics shine for algorithms over arbitrary data shapes (containers, Map/Filter/Reduce), and less so for classic OOP-style polymorphism where a handful of concrete types share behavior. See [Go Interfaces](interfaces.md#interfaces-vs-generics).
- _"What does `~int` do?"_ → matches any type with underlying type `int`. See [constraints](#constraints).
- _"How does Go implement generics?"_ → GCShape stenciling plus dictionaries, a hybrid of monomorphization and erasure. See [GCShape stenciling and dictionaries](#gcshape-stenciling-and-dictionaries).

## Sources

- [Go language specification: type parameters](https://go.dev/ref/spec#Type_parameter_declarations)
- [Generics implementation dictionaries design](https://go.googlesource.com/proposal/+/master/design/generics-implementation-dictionaries-go1.18.md)
- [Go 1.26 language changes](https://go.dev/doc/go1.26)
- [`cmp` package](https://pkg.go.dev/cmp)
