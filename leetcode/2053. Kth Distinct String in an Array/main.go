package main

import "sort"

type item struct {
	key string
	idx int
}

func kthDistinct(arr []string, k int) string {
	valueToIdx := make(map[string]int, len(arr))
	for i, v := range arr {
		if _, ok := valueToIdx[v]; !ok {
			valueToIdx[v] = i
		}
	}

	freq := make(map[string]int, len(arr))
	for _, v := range arr {
		freq[v]++
	}

	items := make([]item, 0, len(freq))
	for v, f := range freq {
		if f == 1 {
			items = append(items, item{
				key: v,
				idx: valueToIdx[v],
			})
		}
	}

	if len(items) < k {
		return ""
	}

	sort.Slice(items, func(i, j int) bool {
		return items[i].idx < items[j].idx
	})

	return items[k-1].key
}
