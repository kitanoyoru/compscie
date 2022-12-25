// Solved by @kitanoyoru

package main

import "sort"

func answerQueries(nums []int, queries []int) []int {
	ans := make([]int, len(queries))

	sort.Ints(nums)
	for i := 1; i < len(nums); i++ {
		nums[i] += nums[i-1]
	}

	for i, q := range queries {
		for j, num := range nums {
			if num <= q {
				ans[i] = j + 1
			} else {
				break
			}
		}
	}

	return ans
}
