package main

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func getSum(cnt, end int) int {
	if cnt == 0 {
		return 0
	}

	start := max(end-cnt, 0)

	r_sum := int(end * (end + 1) / 2)
	l_sum := int(start * (start + 1) / 2)

	return r_sum - l_sum

}

func maxValue(n int, index int, maxSum int) int {
	maxSum -= n

	left, right := 0, maxSum

	for left <= right {
		mid := left + (right-left)/2
		l_sum, r_sum := getSum(index+1, mid), getSum(n-index-1, mid-1)
		if l_sum+r_sum <= maxSum {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}

	return left
}
