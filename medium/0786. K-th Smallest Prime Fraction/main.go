package main

import "container/heap"

// First solution

func kthSmallestPrimeFraction(arr []int, k int) []int {
	left, right := 0.0, 1.0

	n := len(arr)
	res := make([]int, 2)

	for left < right {
		mid := left + (right-left)/2

		total, num, den := 0, 0, 0
		maxFrac, j := 0.0, 0

		for i := 0; i < n; i++ {
			for j < n && float64(arr[i])/float64(arr[j]) >= mid {
				j++
			}

			total += n - j

			if j < n && maxFrac < float64(arr[i])/float64(arr[j]) {
				maxFrac = float64(arr[i]) / float64(arr[j])
				num, den = i, j
			}
		}

		if total == k {
			res[0], res[1] = arr[num], arr[den]
			break
		}

		if total > k {
			right = mid
		} else {
			left = mid
		}
	}

	return res
}

// Second solution

type Pair struct {
	Fraction float64
	Num      int
	Den      int
}

type Heap []Pair

func (h Heap) Len() int           { return len(h) }
func (h Heap) Less(i, j int) bool { return h[i].Fraction < h[j].Fraction }
func (h Heap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *Heap) Push(x any) {
	*h = append(*h, x.(Pair))
}

func (h *Heap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func kthSmallestPrimeFractionMinHeap(arr []int, k int) []int {
	n := len(arr)

	h := new(Heap)
	heap.Init(h)

	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			heap.Push(h, Pair{
				Fraction: float64(arr[i]) / float64(arr[j]),
				Num:      arr[i],
				Den:      arr[j],
			})
		}
	}

	var res Pair
	for i := 0; i < k; i++ {
		res = heap.Pop(h).(Pair)
	}

	return []int{res.Num, res.Den}
}
