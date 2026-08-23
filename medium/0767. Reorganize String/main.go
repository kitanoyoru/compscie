package main

import (
	"container/heap"
	"strings"
)

type CharFreq struct {
	char rune
	freq int
}

type Heap []CharFreq

func (h Heap) Len() int {
	return len(h)
}

func (h Heap) Less(i, j int) bool {
	return h[i].freq > h[j].freq
}

func (h Heap) Swap(i, j int) {
	h[i], h[j] = h[j], h[i]
}

func (h *Heap) Push(x interface{}) {
	*h = append(*h, x.(CharFreq))
}

func (h *Heap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func reorganizeString(s string) string {
	freqMap := make(map[rune]int)
	for _, c := range s {
		freqMap[c]++
	}

	maxHeap := &Heap{}
	heap.Init(maxHeap)

	for char, freq := range freqMap {
		heap.Push(maxHeap, CharFreq{char, freq})
	}

	var res strings.Builder
	for maxHeap.Len() >= 2 {
		entry1 := heap.Pop(maxHeap).(CharFreq)
		entry2 := heap.Pop(maxHeap).(CharFreq)

		res.WriteRune(entry1.char)
		res.WriteRune(entry2.char)

		if entry1.freq > 1 {
			heap.Push(maxHeap, CharFreq{char: entry1.char, freq: entry1.freq - 1})
		}
		if entry2.freq > 1 {
			heap.Push(maxHeap, CharFreq{char: entry2.char, freq: entry2.freq - 1})
		}
	}

	if maxHeap.Len() > 0 {
		if entry := heap.Pop(maxHeap).(CharFreq); entry.freq > 1 {
			return ""
		} else {
			res.WriteRune(entry.char)
		}
	}

	return res.String()
}
