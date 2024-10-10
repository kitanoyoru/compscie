package main

func maxWidthRamp(nums []int) int {
	result := 0
	stack := make([]int, 0, len(nums))

	for i, v := range nums {
		if len(stack) == 0 || nums[stack[len(stack)-1]] > v {
			stack = append(stack, i)
		}
	}

	for j := len(nums) - 1; j >= 0; j-- {
		for len(stack) != 0 {
			i := stack[len(stack)-1]

			if nums[i] <= nums[j] {
				result = max(result, j-i)
				stack = stack[:len(stack)-1]
			} else {
				break
			}
		}
	}

	return result
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}
