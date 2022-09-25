// Solved by @kitanoyoru
// https://leetcode.com/problems/design-circular-queue/

class MyCircularQueue {
  private arr: Uint16Array
  private size: number
  private getloc: number
  private putloc: number

  constructor(k: number) {
    this.arr = new Uint16Array(k)
    this.size = k
    this.getloc = 0
    this.putloc = -1
  }

  enQueue(value: number): boolean {
    if (this.isFull()) return false

    this.putloc = (this.putloc + 1) % this.size
    this.arr[this.putloc] = value

    return true
  }

  deQueue(): boolean {
    if (this.isEmpty()) return false
    if (this.putloc == this.getloc) (this.getloc = 0), (this.putloc = -1)
    else this.getloc = (this.getloc + 1) % this.size

    return true
  }

  Front(): number {
    return this.isEmpty() ? -1 : this.arr[this.getloc]
  }

  Rear(): number {
    return this.isEmpty() ? -1 : this.arr[this.putloc]
  }

  isEmpty(): boolean {
    return this.putloc == -1
  }

  isFull(): boolean {
    return !this.isEmpty() && (this.putloc + 1) % this.size == this.getloc
  }
}

/**
 * Your MyCircularQueue object will be instantiated and called as such:
 * var obj = new MyCircularQueue(k)
 * var param_1 = obj.enQueue(value)
 * var param_2 = obj.deQueue()
 * var param_3 = obj.Front()
 * var param_4 = obj.Rear()
 * var param_5 = obj.isEmpty()
 * var param_6 = obj.isFull()
 */
