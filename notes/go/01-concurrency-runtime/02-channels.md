# 📡 Go Channels — Internals, sudog, and Select

> Exported from Notion on 2026-08-23 · [Source](https://app.notion.com/p/3b1a407e452d815fa62ee08279bdbe91)

Notes from interview prep session. Continuation of Day 1 core-language-internals prep (companion docs: "Go Scheduler (GMP)", "Go Interfaces", "Go Slices").

> ✅ Reviewed and expanded. Accurate as of **Go 1.26**. The original content was correct — additions are the **memory-model guarantees** (§7), the `nil`-channel-in-`select` idiom (§6), buffer/sender FIFO handling on receive (§4), ownership rules for `close` (§9), and cost comparison vs mutex/atomic (§10).

## 1. hchan Struct

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

The buffer is a plain **circular/ring buffer** using `sendx`/`recvx` indices. All operations (send/receive/close) briefly acquire the single `lock` — **channel ops are not lock-free**. Worth saying plainly: a channel is a mutex-protected queue plus scheduler integration, not magic.

**Allocation detail:** `makechan` allocates the `hchan` header and the buffer in a **single** allocation when the element type contains no pointers. When it does contain pointers they're allocated separately, so the GC can scan the buffer properly.

## 2. sudog — the link between a channel and a parked goroutine

When a goroutine blocks on a channel op, the runtime creates a **`sudog`** ("pseudo-g") wrapping: a pointer to the actual `g`, and a pointer (`elem`) to the value being transferred. This `sudog` is pushed onto `recvq` or `sendq`.

**Why the indirection:** the same goroutine can be a waiter on multiple channels at once — this is exactly what `select` needs. One G can have `sudog`s registered on several channels' queues simultaneously; whichever fires first wins and the rest are dequeued/cleaned up. A `g` struct has one identity; a `sudog` represents one _waiting relationship_, and there can be many.

`sudog`s are pooled (per-P free lists with a global overflow), so blocking on a channel usually doesn't allocate.

## 3. Key Optimization: Direct Handoff

A buffered channel's buffer is **often bypassed entirely**. If a sender arrives and finds a goroutine already parked on `recvq`, the runtime does a **direct copy** from the sender's stack straight into the receiver's stack (via the sudog's `elem` pointer) and wakes the receiver immediately — the buffer is never touched.

An unbuffered channel can directly hand a value to an already-waiting peer, avoiding a buffer round trip. That does **not** make unbuffered channels universally faster: they impose synchronization, and a miss may park/wake a goroutine. A buffered non-blocking operation can be cheaper for a particular workload. Benchmark the actual contention pattern.

The waking side also uses `goready` with the `runnext` slot (see the Scheduler notes §2), so the woken goroutine typically runs immediately on the same P — preserving cache locality for the data just handed over. Nice detail to drop: the channel and scheduler designs are co-designed here.

## 4. Send / Receive Algorithm

**Send (`ch <- v`):**

1. Lock the channel
2. If `closed` → unlock and **panic**
3. If a goroutine is already parked on `recvq` → direct copy to it, wake it, done (buffer untouched)
4. Else if buffer has room → copy into buffer at `sendx`, advance index, `qcount++`
5. Else (buffer full, or unbuffered with no receiver) → create a `sudog`, push onto `sendq`, park the G

**Receive (`<-ch`):** the mirror image, but with one non-obvious case worth knowing:

- If the buffer is **full and senders are parked**, the receiver takes the element at `recvx` from the buffer **and then moves the head sender's value into the now-free slot at the buffer tail**, before waking that sender. This preserves strict FIFO ordering across the buffer and the sender queue. A naive implementation that handed the parked sender's value directly to the receiver would reorder messages.

**Close:** wakes **every** goroutine parked in both `recvq` and `sendq`. Receivers get the zero value with `ok=false`. Senders parked on `sendq` are woken specifically **to panic** — this is why "never send on a closed channel" is a hard rule, not a style preference.

Note there is deliberately **no `isClosed(ch)` function**. Any such check would be a race: the channel could close between check and send. The language forces you to solve closure through ownership discipline instead (§9).

## 5. select Implementation

1. Builds a **poll order** — the case list shuffled randomly (deliberate fairness; avoids always favouring the first case when several are ready)
2. Builds a **lock order** — all involved channels sorted **by address**, so that locking multiple channels can never deadlock against another `select` locking the same set in a different order
3. Walks the poll order, checking whether any case can proceed immediately without blocking
4. If none can, registers a `sudog` on **every** channel involved (send and receive cases alike), parks the G once
5. Whichever channel op completes first wakes the G; the runtime dequeues/cleans up the `sudog`s on all other channels

**Compiler shortcuts:** `select` with a single case compiles to a plain channel operation. A single case plus `default` compiles to `selectnbsend`/`selectnbrecv` — no `sudog`s, no parking, just a try-lock-and-attempt. So the non-blocking idiom is genuinely cheap and doesn't drag in the full `select` machinery.

## 6. select Special Forms

| Form                      | Behaviour                                                            |
| ------------------------- | -------------------------------------------------------------------- |
| `select {}` (no cases)    | Blocks forever. Triggers the deadlock detector if nothing else runs. |
| `select` with `default`   | Never blocks — `default` runs if no case is ready.                   |
| Case on a **nil** channel | Never ready. Effectively **disabled**.                               |
| All cases nil, no default | Blocks forever.                                                      |

**The nil-channel idiom** is the one worth having ready — it's how you dynamically turn a case off without restructuring the loop:

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

The value expressions in `select` communication cases are evaluated when entering the `select`. Therefore `case out <- pending[0]` can panic before case selection when `pending` is empty—even if `out` is nil. Gate both the channel and value as above.

Without this, receiving from a closed channel makes that case _always_ ready, and the loop spins at 100% CPU. That failure mode — "my worker pegs a core after a producer exits" — is a very common real bug and a good story to have.

## 7. Memory Model Guarantees (happens-before)

Interviewers often ask "why is a channel safe to pass a pointer through?" The answer is the Go memory model, not the copy:

- A **send** on a channel _happens-before_ the corresponding **receive completes**.
- A **receive from an unbuffered channel** _happens-before_ the **send completes**. (This is what makes unbuffered channels a two-way synchronization point, not just a transfer.)
- The **k-th receive** on a channel of capacity C _happens-before_ the **(k+C)-th send** completes. This is the formal basis for using a buffered channel as a **semaphore**.
- **Closing** a channel _happens-before_ a receive that returns zero because the channel is closed.

Practical consequence: everything the sender wrote before the send is guaranteed visible to the receiver after the receive. You may pass a pointer through a channel and read the pointee without further synchronization — provided the sender genuinely stops touching it. The channel transfers _ownership_; it doesn't enforce it.

**Semaphore pattern** (direct application of the third rule):

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

`chan struct{}` carries no data — zero-size element, so no copy at all. Standard for signalling and limiting.

## 8. Channel Operation Cheat Sheet

| Operation           | Channel state                               | Result                                                                       |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| Send (`ch <- v`)    | nil channel                                 | blocks forever                                                               |
| Send (`ch <- v`)    | open, buffer has room (or receiver waiting) | succeeds immediately (direct handoff if receiver waiting)                    |
| Send (`ch <- v`)    | open, buffer full, no receiver waiting      | blocks (parked on sendq) until room/receiver                                 |
| Send (`ch <- v`)    | closed                                      | **panics**: "send on closed channel"                                         |
| Receive (`<-ch`)    | nil channel                                 | blocks forever                                                               |
| Receive (`<-ch`)    | open, buffer has data (or sender waiting)   | succeeds immediately, returns value, `ok=true`                               |
| Receive (`<-ch`)    | open, buffer empty, no sender waiting       | blocks (parked on recvq) until data arrives                                  |
| Receive (`<-ch`)    | closed, buffer drained                      | returns zero value immediately, `ok=false`, does NOT block                   |
| Receive (`<-ch`)    | closed, buffer still has data               | drains remaining buffered values first, `ok=true`, then behaves as above     |
| `for v := range ch` | open                                        | blocks per iteration; exits **only** on close                                |
| Close (`close(ch)`) | already closed                              | **panics**: "close of closed channel"                                        |
| Close (`close(ch)`) | nil channel                                 | **panics**: "close of nil channel"                                           |
| Close (`close(ch)`) | open, with parked senders/receivers         | wakes all of them — receivers get zero value + `ok=false`; senders **panic** |

Note the `range` row: forgetting to close is the single most common goroutine leak, because `range` will wait forever rather than exiting at "no more data".

## 9. Who Closes a Channel

The durable rule is: **the side or coordinator that can prove no future sends will occur closes the channel.** A single producer can close directly; multiple producers normally coordinate through a `WaitGroup` and one closer.

- **One sender, N receivers** → sender closes. Close is a natural broadcast: all receivers unblock at once. This is precisely how `context.Done()` and `chan struct{}` cancellation work.
- **N senders, one receiver** → senders must **not** close (any of them could panic another). Use a separate `done` channel closed by the receiver, and have senders `select` on it.
- **N senders, N receivers** → dedicated coordinator, or `sync.WaitGroup` around the senders with a single goroutine doing `wg.Wait(); close(ch)`.

You do not have to close a channel at all — an unreferenced channel is garbage collected normally. Close is a _signal_, not cleanup. Closing only matters when a receiver needs to learn "no more values are coming."

## 10. Cost — When Not to Use a Channel

A durable relative model is more useful than nanosecond figures, which change with CPU, Go version, contention, element size, and cache state:

1. A simple atomic operation is usually the cheapest option for one independent value.
2. An uncontended mutex is usually cheaper than coordinating through a channel.
3. A channel operation adds locking and value-transfer work.
4. Any operation that parks and later wakes a goroutine adds scheduler latency.

Use `go test -bench` on the target architecture when the difference matters.

"Share memory by communicating" is a design guideline, not a performance claim. For a shared counter or a simple guarded map, a mutex or atomic is substantially cheaper — a channel adds a lock **plus** scheduler work. Channels earn their cost when you need **ownership transfer, cancellation, fan-in/fan-out, or backpressure**. Being able to say when _not_ to reach for a channel usually reads as more senior than knowing the internals.

## 11. Interview Drills

- _"What's inside a channel?"_ → §1 + the "mutex-protected ring buffer with scheduler hooks" framing
- _"Why does select need sudog?"_ → one G, many waiting relationships (§2)
- _"Is an unbuffered channel slower?"_ → it can direct-handoff to a waiting peer, but synchronization/parking dominates in other cases; benchmark the workload (§3)
- _"Why does select randomize?"_ → fairness/starvation; also mention the address-sorted lock order (§5)
- _"How do I stop a select case from firing?"_ → set the channel to nil (§6)
- _"Is it safe to send a pointer through a channel?"_ → memory model happens-before (§7)
- _"Who should close?"_ → §9; and "why is there no isClosed()?" → it would inherently race (§4)

## Official Sources

- [`runtime/chan.go`](https://go.dev/src/runtime/chan.go)
- [`runtime/select.go`](https://go.dev/src/runtime/select.go)
- [Go memory model](https://go.dev/ref/mem)
