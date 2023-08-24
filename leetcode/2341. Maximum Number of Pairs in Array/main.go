// Solved by @kitanoyoru

package main

func numberOfPairs(nums []int) []int {
	hm := make(map[int]int)
	for _, v := range nums {
		hm[v]++
	}

	ans := [2]int{0, 0}

	for _, v := range hm {
		ans[0] += v / 2
		ans[1] += v % 2
	}

	return ans[:]
}
