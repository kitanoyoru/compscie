package main

type MyStack struct {
	arr []int
}

func Constructor() MyStack {
	return MyStack{
		arr: []int{},
	}

}

func (this *MyStack) Push(x int) {
	this.arr = append(this.arr, x)
}

func (this *MyStack) Pop() int {
	if !this.Empty() {
		x := this.arr[len(this.arr)-1]
		this.arr = this.arr[:len(this.arr)-1]
		return x
	}

	return -1
}

func (this *MyStack) Top() int {
	if !this.Empty() {
		return this.arr[len(this.arr)-1]
	}

	return -1
}

func (this *MyStack) Empty() bool {
	return len(this.arr) == 0
}

/**
 * Your MyStack object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Push(x);
 * param_2 := obj.Pop();
 * param_3 := obj.Top();
 * param_4 := obj.Empty();
 */
