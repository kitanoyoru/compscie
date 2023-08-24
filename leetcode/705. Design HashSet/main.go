package main

type MyHashSet struct {
	set [125001]byte
}

func Constructor() MyHashSet {
	return MyHashSet{}
}

func (this *MyHashSet) Add(key int) {
	byt, bit := this.findPosition(key)
	this.set[byt] |= 1 << bit
}

func (this *MyHashSet) Remove(key int) {
	byt, bit := this.findPosition(key)
	this.set[byt] &= ^(1 << bit)
}

func (this *MyHashSet) Contains(key int) bool {
	byt, bit := this.findPosition(key)
	v := this.set[byt]
	return v&(1<<bit) != 0
}

func (this *MyHashSet) findPosition(key int) (int, int) {
	byt := key / 8
	bit := key % 8

	return byt, bit
}
