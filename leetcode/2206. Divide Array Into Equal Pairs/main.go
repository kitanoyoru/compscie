// Solved by @kitanoyoru

package main

func divideArray(nums []int) bool {
	hm := make(map[int]int)

	for _, v := range nums {
		hm[v]++
	}

	ans := 0
	for _, v := range hm {
		if v%2 == 1 {
			return false
		}
	}

	return true
}
