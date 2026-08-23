package main

import "container/heap"

type PriorityQueue []int

func (pq PriorityQueue) Len() int {
	return len(pq)
}

func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i] < pq[j]
}

func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
}

func (pq *PriorityQueue) Push(x any) {
	*pq = append(*pq, x.(int))
}

func (pq *PriorityQueue) Pop() any {
	old := *pq
	n := len(old)
	x := old[n-1]
	*pq = old[0 : n-1]
	return x
}

type SeatManager struct {
	last int
	pq   PriorityQueue
}

func Constructor(n int) SeatManager {
	return SeatManager{
		last: 0,
		pq:   PriorityQueue{},
	}
}

func (this *SeatManager) Reserve() int {
	if len(this.pq) == 0 {
		this.last++
		return this.last
	}

	return heap.Pop(&this.pq).(int)
}

func (this *SeatManager) Unreserve(seatNumber int) {
	if seatNumber == this.last {
		this.last--
	} else {
		heap.Push(&this.pq, seatNumber)
	}
}
