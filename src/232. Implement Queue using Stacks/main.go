// Solved by @kitanoyoru

package main

type MyQueue struct {
	buf []int
	n   int
}

func Constructor() MyQueue {
	return MyQueue{
		buf: []int{},
		n:   0,
	}
}

func (this *MyQueue) Push(x int) {
	this.buf = append(this.buf, x)
	this.n++
}

func (this *MyQueue) Pop() int {
	first := this.buf[0]
	this.buf = this.buf[1:]
	this.n--
	return first
}

func (this *MyQueue) Peek() int {
	return this.buf[0]
}

func (this *MyQueue) Empty() bool {
	if this.n == 0 {
		return true
	}

	return false
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Push(x);
 * param_2 := obj.Pop();
 * param_3 := obj.Peek();
 * param_4 := obj.Empty();
 */
