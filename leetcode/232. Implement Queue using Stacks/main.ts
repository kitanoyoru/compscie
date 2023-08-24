// Solved by @kitanoyoru
// https://leetcode.com/problems/implement-queue-using-stacks/

interface MyQueue {
  push(x: number): void
  pop(): number | undefined
  peek(): number | undefined
  empty(): boolean
}

class MyQueue implements MyQueue {
  private storage: number[] = []

  push(x: number): void {
    this.storage.push(x)
  }

  pop(): number | undefined {
    if (!this.empty()) {
      return this.storage.shift()
    }
  }

  peek(): number | undefined {
    if (!this.empty()) {
      return this.storage[0]
    }
  }

  empty(): boolean {
    return this.storage.length ? false : true
  }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
