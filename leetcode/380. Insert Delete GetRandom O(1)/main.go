package main

import "math/rand"

type RandomizedSet struct {
	inner    []int
	valToIdx map[int]int
}

func Constructor() RandomizedSet {
	return RandomizedSet{
		inner:    []int{},
		valToIdx: make(map[int]int),
	}
}

func (this *RandomizedSet) Insert(val int) bool {
	if _, has := this.valToIdx[val]; has {
		return false
	}

	this.inner = append(this.inner, val)
	this.valToIdx[val] = len(this.inner) - 1

	return true
}

func (this *RandomizedSet) Remove(val int) bool {
	if _, has := this.valToIdx[val]; !has {
		return false
	}

	idx := this.valToIdx[val]

	this.inner[idx] = this.inner[len(this.inner)-1]
	this.valToIdx[this.inner[len(this.inner)-1]] = idx

	this.inner = this.inner[:len(this.inner)-1]
	delete(this.valToIdx, val)

	return true
}

func (this *RandomizedSet) GetRandom() int {
	return this.inner[rand.Intn(len(this.inner))]
}
