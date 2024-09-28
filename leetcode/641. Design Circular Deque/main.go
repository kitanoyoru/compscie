package main

type MyCircularDeque struct {
	arr  []int
	head int
	tail int
	size int
	n    int
}

func Constructor(k int) MyCircularDeque {
	return MyCircularDeque{
		arr:  make([]int, k),
		head: 0,
		tail: 0,
		size: 0,
		n:    k,
	}
}

func (this *MyCircularDeque) InsertFront(value int) bool {
	if this.IsFull() {
		return false
	}

	this.head = (this.head - 1 + this.n) % this.n
	this.arr[this.head] = value
	this.size++

	return true
}

func (this *MyCircularDeque) InsertLast(value int) bool {
	if this.IsFull() {
		return false
	}

	this.arr[this.tail] = value
	this.tail = (this.tail + 1) % this.n
	this.size++

	return true
}

func (this *MyCircularDeque) DeleteFront() bool {
	if this.IsEmpty() {
		return false
	}

	this.head = (this.head + 1) % this.n
	this.size--

	return true
}

func (this *MyCircularDeque) DeleteLast() bool {
	if this.IsEmpty() {
		return false
	}

	this.tail = (this.tail - 1 + this.n) % this.n
	this.size--

	return true
}

func (this *MyCircularDeque) GetFront() int {
	if this.IsEmpty() {
		return -1
	}

	return this.arr[this.head]
}

func (this *MyCircularDeque) GetRear() int {
	if this.IsEmpty() {
		return -1
	}

	return this.arr[(this.tail-1+this.n)%this.n]
}

func (this *MyCircularDeque) IsEmpty() bool {
	return this.size == 0
}

func (this *MyCircularDeque) IsFull() bool {
	return this.size == this.n
}
