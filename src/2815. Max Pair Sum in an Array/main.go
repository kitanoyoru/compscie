package main

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func maxSum(nums []int) int {
	res, maxDigits := -1, [10]int{}

	for _, num := range nums {
		maxDigit := 0
		for v := num; v != 0; v /= 10 {
			maxDigit = max(maxDigit, v%10)
		}
		if val := maxDigits[maxDigit]; val != 0 {
			res = max(res, val+num)
		}
		maxDigits[maxDigit] = max(maxDigits[maxDigit], num)
	}

	return res
}
