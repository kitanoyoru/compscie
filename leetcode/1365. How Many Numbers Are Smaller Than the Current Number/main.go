// Solved by @kitanoyoru

package main

func smallerNumbersThanCurrent(nums []int) []int {
	hm := make(map[int]int)
	for i := 0; i < len(nums); i++ {
		for j := 0; j < len(nums); j++ {
			if i != j && nums[i] > nums[j] {
				hm[i]++
			}
		}
	}

	ans := make([]int, len(nums))
	for i, num := range hm {
		ans[i] = num
	}

	return ans
}
