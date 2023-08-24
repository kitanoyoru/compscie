// Solved by @kitanoyoru

package main

func numIdenticalPairs(nums []int) int {
	hm, hs := make(map[int]int), make(map[int]bool)
	for _, num := range nums {
		hm[num]++
	}

	ans := 0
	for _, num := range nums {
		if !hs[num] {
			ans += hm[num] * (hm[num] - 1) / 2
			hs[num] = true
		}
	}

	return ans
}
