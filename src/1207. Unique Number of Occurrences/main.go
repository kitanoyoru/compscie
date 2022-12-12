// Solved by @kitanoyoru

package main

func uniqueOccurrences(arr []int) bool {
	hm := make(map[int]int)

	for _, num := range arr {
		hm[num]++
	}

	temp := make(map[int]bool)
	for _, v := range hm {
		if val, ok := temp[v]; ok && val {
			return false
		}
		temp[v] = true
	}

	return true
}
