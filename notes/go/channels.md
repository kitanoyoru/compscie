---
date: 2026-08-23
---

# Go Channels

> A channel is a pointer to a runtime `hchan` struct: a mutex-protected ring buffer plus two queues of parked goroutines. Channel operations are not lock-free, and they integrate with the scheduler through `sudog`s and direct handoff. `select` registers one goroutine on many channels at once. Checked against Go 1.26.

## Questions this answers

- What is inside a channel, and why is it not lock-free?
- Why does `select` need `sudog`, and how does it avoid deadlocking on its own locks?
- How do you switch off a `select` case at runtime, and why does a closed channel make a worker spin?
- Why is it safe to pass a pointer through a channel?
- Who should close a channel, and why is there no `isClosed()`?
- When is a channel the wrong tool compared with a mutex or an atomic?

## Notes

### `hchan` struct

A channel is a pointer to a runtime struct:

```go
type hchan struct {
    qcount   uint           // elements currently in the queue
    dataqsiz uint           // size of the circular buffer (0 for unbuffered)
    buf      unsafe.Pointer // circular buffer, if buffered
    elemsize uint16
    closed   uint32
    elemtype *_type         // element type, for typed copies + write barriers
    sendx    uint           // send index into the circular buffer
    recvx    uint           // receive index into the circular buffer
    recvq    waitq          // list of goroutines blocked on receive (sudog queue)
    sendq    waitq          // list of goroutines blocked on send (sudog queue)
    lock     mutex          // protects all of the above
}
```

The buffer is a plain **circular (ring) buffer** that uses the `sendx` and `recvx` indices. All operations (send, receive, close) briefly acquire the single `lock`, so **channel operations are not lock-free**. Worth saying plainly: a channel is a mutex-protected queue plus scheduler integration, not magic.

**Allocation detail:** `makechan` allocates the `hchan` header and the buffer in a **single** allocation when the element type contains no pointers. When it does contain pointers, they are allocated separately so the GC can scan the buffer properly.

### `sudog` and parked goroutines

When a goroutine blocks on a channel operation, the runtime creates a **`sudog`** ("pseudo-g"). It wraps a pointer to the actual `g` and a pointer (`elem`) to the value being transferred. The `sudog` is pushed onto `recvq` or `sendq`.

**Why the indirection:** the same goroutine can wait on several channels at once, and that is exactly what `select` needs. One G can have `sudog`s registered on several channels' queues simultaneously. Whichever fires first wins, and the rest are dequeued and cleaned up. A `g` struct has one identity. A `sudog` represents one _waiting relationship_, and there can be many.

`sudog`s are pooled (per-P free lists with a global overflow), so blocking on a channel usually does not allocate.

### Direct handoff

A buffered channel's buffer is **often bypassed entirely**. If a sender arrives and finds a goroutine already parked on `recvq`, the runtime does a **direct copy** from the sender's stack straight into the receiver's stack (via the `sudog`'s `elem` pointer). It then wakes the receiver immediately, and the buffer is never touched.

An unbuffered channel can hand a value directly to an already-waiting peer, which avoids a buffer round trip. That does **not** make unbuffered channels universally faster. They impose synchronization, and a miss may park and wake a goroutine. A buffered non-blocking operation can be cheaper for a particular workload. Benchmark the actual contention pattern.

The waking side also uses `goready` with the `runnext` slot (see [Go Scheduler (GMP)](scheduler-gmp.md)), so the woken goroutine typically runs immediately on the same P. That preserves cache locality for the data just handed over. Nice detail to drop: the channel and scheduler designs are co-designed here.

### Send and receive algorithm

**Send (`ch <- v`):**

1. Lock the channel.
2. If `closed`, unlock and **panic**.
3. If a goroutine is already parked on `recvq`, copy directly to it and wake it. Done, and the buffer is untouched.
4. Else if the buffer has room, copy into the buffer at `sendx`, advance the index, and do `qcount++`.
5. Else (buffer full, or unbuffered with no receiver), create a `sudog`, push it onto `sendq`, and park the G.

**Receive (`<-ch`):** the mirror image, with one non-obvious case worth knowing.

- If the buffer is **full and senders are parked**, the receiver takes the element at `recvx` from the buffer **and then moves the head sender's value into the now-free slot at the buffer tail**, before waking that sender. This preserves strict FIFO ordering across the buffer and the sender queue. A naive implementation that handed the parked sender's value directly to the receiver would reorder messages.

**Close:** wakes **every** goroutine parked in both `recvq` and `sendq`. Receivers get the zero value with `ok=false`. Senders parked on `sendq` are woken specifically **to panic**. This is why "never send on a closed channel" is a hard rule, not a style preference.

Note there is deliberately **no `isClosed(ch)` function**. Any such check would be a race, because the channel could close between the check and the send. The language forces you to solve closure through ownership discipline instead (see [who closes a channel](#who-closes-a-channel)).

### `select` implementation

1. Build a **poll order**: the case list shuffled randomly. This is deliberate fairness and avoids always favouring the first case when several are ready.
2. Build a **lock order**: all involved channels sorted **by address**. Locking multiple channels can then never deadlock against another `select` locking the same set in a different order.
3. Walk the poll order, checking whether any case can proceed immediately without blocking.
4. If none can, register a `sudog` on **every** channel involved (send and receive cases alike) and park the G once.
5. Whichever channel operation completes first wakes the G, and the runtime dequeues and cleans up the `sudog`s on all other channels.

**Compiler shortcuts:** a `select` with a single case compiles to a plain channel operation. A single case plus `default` compiles to `selectnbsend` or `selectnbrecv`: no `sudog`s, no parking, just a try-lock-and-attempt. So the non-blocking idiom is genuinely cheap and does not drag in the full `select` machinery.

### `select` special forms

| Form                      | Behaviour                                                            |
| ------------------------- | -------------------------------------------------------------------- |
| `select {}` (no cases)    | Blocks forever. Triggers the deadlock detector if nothing else runs. |
| `select` with `default`   | Never blocks. `default` runs if no case is ready.                    |
| Case on a **nil** channel | Never ready. Effectively **disabled**.                               |
| All cases nil, no default | Blocks forever.                                                      |

The nil-channel row is the one worth having ready. See [Nil-channel idiom in `select`](#nil-channel-idiom-in-select).

### Memory-model guarantees

Interviewers often ask "why is a channel safe to pass a pointer through?" The answer is the Go memory model, not the copy. See [Go Memory Model](memory-model.md).

- A **send** on a channel _happens-before_ the corresponding **receive completes**.
- A **receive from an unbuffered channel** _happens-before_ the **send completes**. This is what makes unbuffered channels a two-way synchronization point, not just a transfer.
- The **k-th receive** on a channel of capacity C _happens-before_ the **(k+C)-th send** completes. This is the formal basis for using a buffered channel as a **semaphore**.
- **Closing** a channel _happens-before_ a receive that returns zero because the channel is closed.

Practical consequence: everything the sender wrote before the send is guaranteed visible to the receiver after the receive. You may pass a pointer through a channel and read the pointee without further synchronization, provided the sender genuinely stops touching it. The channel transfers _ownership_. It does not enforce it.

### Semaphore pattern

A direct application of the third rule above:

```go
sem := make(chan struct{}, maxConcurrent)
for _, job := range jobs {
    sem <- struct{}{}          // acquire
    go func(j Job) {
        defer func() { <-sem }() // release
        process(j)
    }(job)
}
```

`chan struct{}` carries no data. The element is zero-size, so there is no copy at all. This is the standard form for signalling and limiting.

### Operation cheat sheet

| Operation           | Channel state                               | Result                                                                      |
| ------------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| Send (`ch <- v`)    | nil channel                                 | blocks forever                                                              |
| Send (`ch <- v`)    | open, buffer has room (or receiver waiting) | succeeds immediately (direct handoff if receiver waiting)                   |
| Send (`ch <- v`)    | open, buffer full, no receiver waiting      | blocks (parked on sendq) until room/receiver                                |
| Send (`ch <- v`)    | closed                                      | **panics**: "send on closed channel"                                        |
| Receive (`<-ch`)    | nil channel                                 | blocks forever                                                              |
| Receive (`<-ch`)    | open, buffer has data (or sender waiting)   | succeeds immediately, returns value, `ok=true`                              |
| Receive (`<-ch`)    | open, buffer empty, no sender waiting       | blocks (parked on recvq) until data arrives                                 |
| Receive (`<-ch`)    | closed, buffer drained                      | returns zero value immediately, `ok=false`, does **not** block              |
| Receive (`<-ch`)    | closed, buffer still has data               | drains remaining buffered values first, `ok=true`, then behaves as above    |
| `for v := range ch` | open                                        | blocks per iteration; exits **only** on close                               |
| Close (`close(ch)`) | already closed                              | **panics**: "close of closed channel"                                       |
| Close (`close(ch)`) | nil channel                                 | **panics**: "close of nil channel"                                          |
| Close (`close(ch)`) | open, with parked senders/receivers         | wakes all of them: receivers get zero value + `ok=false`; senders **panic** |

Note the `range` row. Forgetting to close is the single most common goroutine leak, because `range` waits forever instead of exiting at "no more data".

### Who closes a channel

The durable rule is: **the side or coordinator that can prove no future sends will occur closes the channel.** A single producer can close directly. Multiple producers normally coordinate through a `WaitGroup` and one closer (see [Go sync.WaitGroup](waitgroup.md)).

- **One sender, N receivers:** the sender closes. Close is a natural broadcast, because all receivers unblock at once. This is precisely how `context.Done()` and `chan struct{}` cancellation work.
- **N senders, one receiver:** senders must **not** close, because any of them could panic another. Use a separate `done` channel closed by the receiver, and have senders `select` on it.
- **N senders, N receivers:** use a dedicated coordinator, or a `sync.WaitGroup` around the senders with a single goroutine doing `wg.Wait(); close(ch)`.

You do not have to close a channel at all. An unreferenced channel is garbage collected normally. Close is a _signal_, not cleanup. It only matters when a receiver needs to learn "no more values are coming."

### Cost and when not to use a channel

A durable relative model is more useful than nanosecond figures, which change with CPU, Go version, contention, element size, and cache state:

1. A simple atomic operation is usually the cheapest option for one independent value.
2. An uncontended mutex is usually cheaper than coordinating through a channel (see [Go sync.Mutex](mutex.md)).
3. A channel operation adds locking and value-transfer work.
4. Any operation that parks and later wakes a goroutine adds scheduler latency.

Use `go test -bench` on the target architecture when the difference matters.

"Share memory by communicating" is a design guideline, not a performance claim. For a shared counter or a simple guarded map, a mutex or atomic is substantially cheaper, because a channel adds a lock **plus** scheduler work. Channels earn their cost when you need **ownership transfer, cancellation, fan-in/fan-out, or backpressure**. Being able to say when _not_ to reach for a channel usually reads as more senior than knowing the internals.

## Gotchas

### Nil-channel idiom in `select`

**Symptom:** a worker pegs a core at 100% CPU after one of its producers exits.

**Cause:** receiving from a closed channel is _always_ ready. If the loop keeps that case in its `select`, the case fires on every iteration and the loop spins.

**Fix:** set the channel variable to `nil`. A nil channel is never ready, so the case is disabled without restructuring the loop:

```go
for in != nil || len(pending) > 0 {
    var sendCh chan<- T
    var sendVal T
    if len(pending) > 0 {
        sendCh = out
        sendVal = pending[0]
    }

    select {
    case v, ok := <-in:
        if !ok {
            in = nil // disabled: a nil channel is never ready
            continue
        }
        pending = append(pending, v)
    case sendCh <- sendVal:
        pending = pending[1:]
    }
}
```

The value expressions in `select` communication cases are evaluated when entering the `select`. Therefore `case out <- pending[0]` can panic before case selection when `pending` is empty, even if `out` is nil. Gate both the channel and the value as above.

"My worker pegs a core after a producer exits" is a very common real bug and a good story to have.

## Interview drills

- _"What's inside a channel?"_ → the [`hchan` struct](#hchan-struct): a mutex-protected ring buffer with scheduler hooks.
- _"Why does select need sudog?"_ → one G, many waiting relationships. See [`sudog` and parked goroutines](#sudog-and-parked-goroutines).
- _"Is an unbuffered channel slower?"_ → it can direct-handoff to a waiting peer, but synchronization and parking dominate in other cases. Benchmark the workload. See [direct handoff](#direct-handoff).
- _"Why does select randomize?"_ → fairness and starvation. Also mention the address-sorted lock order. See [`select` implementation](#select-implementation).
- _"How do I stop a select case from firing?"_ → set the channel to nil. See [Nil-channel idiom in `select`](#nil-channel-idiom-in-select).
- _"Is it safe to send a pointer through a channel?"_ → yes, because of memory-model happens-before. See [memory-model guarantees](#memory-model-guarantees).
- _"Who should close?"_ → see [who closes a channel](#who-closes-a-channel). And "why is there no isClosed()?" → it would inherently race (see [send and receive algorithm](#send-and-receive-algorithm)).

## Sources

- [`runtime/chan.go`](https://go.dev/src/runtime/chan.go)
- [`runtime/select.go`](https://go.dev/src/runtime/select.go)
- [Go memory model](https://go.dev/ref/mem)
