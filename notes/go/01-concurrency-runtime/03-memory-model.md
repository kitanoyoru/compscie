# 🧠 Go Memory Model — Practical Happens-Before Guide

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b2a407e452d81a2b88edf55ac74cb7d)

> 🧭 **Practical rule:** if two goroutines touch the same mutable data, establish a documented synchronization edge. "It usually runs first" is not synchronization.

> ✅ Reviewed against the **Go 1.26** memory model and standard-library contracts on 4 Aug 2026. Language guarantees are separated from runtime implementation details.

## 1. The Mental Model

A **data race** is a read or write to a memory location concurrent with another write to that location, unless the accesses are atomic. Race-free Go programs have **DRF-SC**: they behave as though all goroutines were interleaved on a single processor in a sequentially consistent order.

This does **not** mean goroutines execute in source order. Connect operations with a *happens-before* relationship.

> ⚠️ Do not use sleeps, scheduler timing, "it worked in tests," or ordinary loads/stores as publication mechanisms. Use channels, locks, atomics, or another API with an explicit synchronization contract.

## 2. Core Synchronization Edges

| Primitive | Guaranteed edge | Typical use |
| --- | --- | --- |
| Channel send/receive | A send is synchronized before the corresponding receive completes. | Publish data with ownership transfer. |
| Channel close | Closing is synchronized before a receive that returns because the channel is closed. | Broadcast completion. |
| Buffered channel | The kth receive is synchronized before completion of the k+Cth send, where C is capacity. | Bounded concurrency. |
| `Mutex` / `RWMutex` | An `Unlock` is synchronized before a later successful `Lock`. | Protect shared invariants. |
| `Once` | Return from the function passed to `Do` is synchronized before return from every `Do` call. | One-time publication. |
| Atomics | Atomic operations behave as though executed in one sequentially consistent order. | Small state machines and flags. |

## 3. Channels: Publication, Not Just Transport

```go
type Config struct{ Region string }

func load(out chan<- *Config) {
	cfg := &Config{Region: "eu-central"}
	out <- cfg
}

func main() {
	ch := make(chan *Config)
	go load(ch)
	cfg := <-ch
	fmt.Println(cfg.Region)
}
```

For an **unbuffered** channel, the receive is synchronized before the send completes as well. That extra edge is why unbuffered channels can act as rendezvous points.

## 4. Locks Protect Invariants

The mutex protects the relationship between operations, not merely a field. Keep the invariant and the lock together; copying a used mutex or exposing protected fields defeats that design.

`TryLock` and `TryRLock` have no synchronizing effect when they fail. Successful calls are equivalent to their blocking counterparts.

## 5. Once, Cond, WaitGroup, and Pool

- **`sync.Once`:** one-time initialization whose result must be visible to all callers. If the function panics, that `Once` is still considered done.
- **`sync.Cond`:** `Broadcast` or `Signal` synchronizes before a `Wait` it unblocks. Check the condition in a loop because it can change before the waiter reacquires the lock.
- **`sync.WaitGroup`:** task completion synchronizes with the `Wait` it unblocks. Call `Add` before starting work; on current Go, `WaitGroup.Go` packages the common add/start/done pattern.
- **`sync.Pool`:** a `Put(x)` can synchronize before a `Get` returning that same `x`, but the pool may drop entries at any time. It is a cache, not storage.

## 6. Atomics: Precise but Narrow

Atomics are excellent for one counter, pointer, or well-defined state transition. They are poor substitutes for a lock protecting several fields together. Prefer typed atomics (`atomic.Bool`, `atomic.Int64`, `atomic.Pointer[T]`). If you cannot state the state machine and invariant in a few sentences, a mutex is usually clearer.

## 7. Initialization and Goroutine Start

Package initialization is sequenced before `main.main` begins. A `go f()` statement is synchronized before `f` starts executing.

There is **no reverse edge** from a goroutine finishing back to its creator. Join it with a channel, `WaitGroup`, or another synchronization primitive.

## 8. Common Broken Patterns

- **Busy-waiting on ordinary memory:** a plain `done bool` flag has a race; use a channel, lock, or atomic publication protocol.
- **Double-checked locking without atomics:** reading a pointer outside the lock while another goroutine writes it is still a race.
- **Copying locks:** structs containing a used `Mutex`, `RWMutex`, `Once`, `Cond`, atomic value, or `WaitGroup` generally must not be copied.

## 9. Review Checklist

- [ ] Every shared mutable field has an identifiable owner or lock.
- [ ] Publication uses a documented synchronization primitive.
- [ ] Atomics protect one explicit state machine, not a hidden multi-field invariant.
- [ ] `go test -race ./...` runs in CI for representative tests.
- [ ] Cancellation and completion paths cannot leave waiters parked forever.

## Interview Drills

- *"What does data-race-free buy you?"* → DRF-SC.
- *"Does starting a goroutine guarantee its writes are visible later?"* → start creates an edge into the goroutine, not a join edge back.
- *"Can a failed TryLock be used as a memory fence?"* → no.

## Official Sources

- [The Go Memory Model](https://go.dev/ref/mem)
- [Package sync](https://pkg.go.dev/sync)
- [Package sync/atomic](https://pkg.go.dev/sync/atomic)
- [Data Race Detector](https://go.dev/doc/articles/race_detector)
