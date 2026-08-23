package main

import (
	"container/heap"
)

// 0 - index; 1 - soldiers
type SoldierHeap [][2]int

func (h SoldierHeap) Len() int {
	return len(h)
}

func (h SoldierHeap) Less(i, j int) bool {
	if h[i][1] == h[j][1] {
		return h[i][0] < h[j][0]
	}

	return h[i][1] < h[j][1]
}

func (h SoldierHeap) Swap(i, j int) {
	h[i], h[j] = h[j], h[i]
}

func (h *SoldierHeap) Push(x any) {
	*h = append(*h, x.([2]int))
}

func (h *SoldierHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func countSoldiers(arr []int) int {
	start, end := 0, len(arr)-1

	for start <= end {
		mid := start + (end-start)/2
		if arr[mid] == 1 {
			start = mid + 1
		} else {
			end = mid - 1
		}
	}

	return start
}

func kWeakestRows(mat [][]int, k int) []int {
	soldiers := &SoldierHeap{}
	for i, row := range mat {
		s := countSoldiers(row)
		heap.Push(soldiers, [2]int{i, s})
	}

	ans := []int{}
	for i := 0; i < k; i++ {
		ans = append(ans, heap.Pop(soldiers).([2]int)[0])
	}

	return ans
}
