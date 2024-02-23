package kata

func splitArrayByHalf(arr []int) ([]int, []int) {
	idx := len(arr) / 2
	return arr[:idx], arr[idx:]
}

func calculateArraySum(first, second []int) []int {
	minArr, maxArr := first, second
	if len(second) < len(minArr) {
		maxArr = second
	}
	if len(second) > len(maxArr) {
		maxArr = second
	}

	diff := len(maxArr) - len(minArr)

	ans := make([]int, len(maxArr))
	for i := 0; i < len(minArr); i++ {
		ans[i+diff] = minArr[i] + maxArr[i+diff]
	}

	for i := 0; i < diff; i++ {
		ans[i] = maxArr[i]

	}

	return ans
}

func SplitAndAdd(numbers []int, n int) []int {
	ans := numbers

	for i := 0; i < n; i++ {
		if len(ans) == 1 {
			break
		}

		first, second := splitArrayByHalf(ans)
		ans = calculateArraySum(first, second)
	}

	return ans
}
