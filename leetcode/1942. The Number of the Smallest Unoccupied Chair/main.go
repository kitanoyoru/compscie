package main

import (
	"container/heap"
	"sort"
)

type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *IntHeap) Push(x interface{}) {
	*h = append(*h, x.(int))
}

func (h *IntHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

type EventHeap [][2]int

func (h EventHeap) Len() int           { return len(h) }
func (h EventHeap) Less(i, j int) bool { return h[i][0] < h[j][0] }
func (h EventHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *EventHeap) Push(x interface{}) {
	*h = append(*h, x.([2]int))
}

func (h *EventHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func smallestChair(times [][]int, targetFriend int) int {
	arrivals := make([][2]int, len(times))
	for i, v := range times {
		arrivals[i] = [2]int{v[0], i}
	}

	sort.Slice(arrivals, func(i, j int) bool {
		return arrivals[i][0] < arrivals[j][0]
	})

	availableChairs := &IntHeap{}
	heap.Init(availableChairs)
	for i := 0; i < len(times); i++ {
		heap.Push(availableChairs, i)
	}

	leavingHeap := &EventHeap{}
	heap.Init(leavingHeap)

	for _, arrival := range arrivals {
		arrivalTime, friendIdx := arrival[0], arrival[1]

		for leavingHeap.Len() > 0 && (*leavingHeap)[0][0] <= arrivalTime {
			heap.Push(availableChairs, heap.Pop(leavingHeap).([2]int)[1])
		}

		chair := heap.Pop(availableChairs).(int)

		if friendIdx == targetFriend {
			return chair
		}

		heap.Push(leavingHeap, [2]int{times[friendIdx][1], chair})
	}

	return -1
}

