# Go Generics — Constraints, Inference, and GCShape

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b2a407e452d81d7be23c8d09a7aad51)

Notes from interview prep session. Companion to the core language-internals pages.

> ✅ Reviewed for **Go 1.26**. Separate language guarantees (constraints and inference) from compiler implementation details (GCShape stenciling and dictionaries).

## 1. Syntax Basics

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

`T`/`U` are type parameters, constrained by an interface (`any` = no constraint, `comparable` = supports `==`/`!=`). Type inference usually determines concrete types from function arguments — explicit instantiation (`Map[int, string](...)`) is only needed when a type parameter appears solely in the return type, with nothing to infer from.

## 2. Constraints

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

**The `~` (tilde) detail:** `~int` means "any type whose *underlying type* is `int`," not just `int` itself. Without the tilde, a custom type like `type UserID int` would NOT satisfy the constraint even though it behaves like an int — with `~int`, it does.

**`comparable`** is a built-in constraint (not library-based) meaning the type supports `==`/`!=`. Structs containing slices, maps, or funcs don't satisfy it — same restriction covered under interface equality panics.

## 3. Implementation: GCShape Stenciling + Dictionaries

> ⚠️ GC shapes, dictionaries, layouts, and calling conventions are compiler implementation details—not Go language guarantees. Use them for performance reasoning, but re-check the compiler source/design when version precision matters.

Three approaches a language could take for generics:

- **C++ templates**: full **monomorphization** — a separate compiled copy of the function per distinct type instantiation. Fastest at runtime, can bloat binary size.
- **Java generics**: **type erasure** — one compiled version; type parameters erased, everything goes through `Object` references (boxing primitives, dynamic casts). Small binaries, real runtime cost from boxing/indirection.
- **Go**: a hybrid called **GCShape stenciling**.

**The precise GCShape rule (from Go's official design doc):** two concrete types share a GCShape if and only if they have the same underlying type, OR they are both pointer types. So `*Foo` and `*Bar` share a shape purely by both being pointers, regardless of what they point to — while `int` and `int32` are kept in SEPARATE shapes despite both being small non-pointer values, because their actual instructions differ (e.g. shift operations behave differently at different widths).

**Types sharing a GCShape compile to ONE shared machine-code instantiation.** Types with distinct GCShapes each get their own separately compiled version — essentially free, same as hand-written non-generic code.

### The Dictionary

For shared-shape instantiations, the compiler passes a hidden **dictionary** parameter at each call site so the shared code can still behave correctly per concrete type.

**Key fact:** the dictionary is NOT a single fixed struct type. Because it's entirely compile-time and read-only, it doesn't need to follow any particular structure — it's just an array of bytes, and the compiler assigns meaning to each field as needed, tailored per call site to exactly what that function body requires.

Conceptually it's built from:

1. **A `*runtime._type` reference for each instantiated type parameter** (T1, T2, ...) — used for stack traceback printing, computing sizes, converting to `interface{}`
2. **Resolved method pointers** for any method the constraint requires — if T must satisfy a constraint with a method, the dictionary carries the concrete function pointer for that specific type's implementation
3. **itab-equivalent entries** for converting a type parameter's value into an interface, when the generic code does that internally
4. **Sub-dictionaries** — if the generic function calls another generic function using its own type parameters, it constructs and passes a nested dictionary for that inner call

Mechanically, the dictionary is an extra hidden argument to shared-shape code. Its register/stack placement is architecture- and compiler-version-specific and should not be memorized as a portable rule.

**Follow-up to have ready:** *"Why is `*Foo` and `*Bar` sharing a shape safe, given they point to totally different types?"* → The shared compiled code only ever needs to dereference, copy, or hand the pointer to the GC as "trace this word as a pointer" — none of that cares what's on the other end. Anything that DOES need to know the pointed-to type (calling a method, computing element size) goes through the dictionary instead of being baked into the shared machine code.

## 4. Performance Implications

- **Non-shared shapes** (e.g. `int`, `float64`): fully specialized compiled version — essentially free, same as hand-written.
- **Shared shapes going through the dictionary**: small overhead vs. true monomorphization — some operations (e.g. calling a method through the dictionary) go through an extra indirection rather than a direct static call.
- Generics often avoid interface boxing and type assertions in containers, but that does not guarantee fewer heap allocations: escape analysis, inlining, dictionary dispatch, and the concrete operation still determine the result. Benchmark and inspect `-gcflags='-m'` for a hot path.

## 5. Real Limitations

**No new type parameters on methods.** A method can use its receiver type's parameters but can't introduce fresh ones:

```go
type List[T any] struct{ items []T }
func (l List[T]) Map[U any](f func(T) U) List[U] { ... } // NOT allowed
```

Genuine language limitation — common workaround is a free function instead of a method (like `Map` at the top).

**Type inference gaps.** If a type parameter appears ONLY in the return type, the compiler often can't infer it — requires explicit instantiation: `Zero[int]()`.

## 6. Go 1.26 Language Additions

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

These are language changes; unlike GCShape details, they are portable guarantees for modules targeting Go 1.26 or newer.

## 7. Concrete Patterns to Have Ready to Write Live

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

## 8. Follow-ups to Have Ready

- *"When would you deliberately NOT use generics?"* → When a simple `interface{ Method() }`-based polymorphic design already captures the need cleanly and the type set is naturally small/fixed. Generics shine for algorithms over arbitrary data shapes (containers, Map/Filter/Reduce), less so for classic OOP-style polymorphism where a handful of concrete types share behavior.

## Official Sources

- [Go language specification: type parameters](https://go.dev/ref/spec#Type_parameter_declarations)
- [Generics implementation dictionaries design](https://go.googlesource.com/proposal/+/master/design/generics-implementation-dictionaries-go1.18.md)
- [Go 1.26 language changes](https://go.dev/doc/go1.26)
- [`cmp` package](https://pkg.go.dev/cmp)
