// Solved by @kitanoyoru

package main

func countKDifference(nums []int, k int) int {
	hm := make(map[int]int)
	ans := 0

	for _, num := range nums {
		ans += hm[num+k]
		ans += hm[num-k]
		hm[num]++
	}

	return ans
}
