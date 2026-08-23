package main

import "sort"

func threeSum(nums []int) [][]int {
	sort.Ints(nums)

	var result [][]int

	for i := 0; i < len(nums); i++ {
		if i > 0 && nums[i] == nums[i-1] {
			continue
		}

		j, k := i+1, len(nums)-1

		for j < k {
			total := nums[i] + nums[j] + nums[k]

			if total < 0 {
				j += 1
			} else if total > 0 {
				k -= 1
			} else {
				result = append(result, []int{nums[i], nums[j], nums[k]})
				j += 1
				k -= 1

				for j < k && nums[j] == nums[j-1] {
					j += 1
				}

				for j < k && nums[k] == nums[k+1] {
					k -= 1
				}
			}
		}
	}

	return result
}
