package main

func maxProduct(nums []int) int {
	res := nums[0]
	maxEnding, minEnding := nums[0], nums[0]

	for i := 1; i < len(nums); i++ {
		n := nums[i]
		if n < 0 {
			maxEnding, minEnding = minEnding, maxEnding
		}

		maxEnding = max(n, maxEnding*n)
		minEnding = min(n, minEnding*n)

		res = max(res, maxEnding)
	}

	return res
}
