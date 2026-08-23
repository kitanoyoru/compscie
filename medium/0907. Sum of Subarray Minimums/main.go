package main

func sumSubarrayMins(arr []int) int {
	var mod int64 = 1e9 + 7

	n := len(arr)

	left, right := make([]int64, n), make([]int64, n)

	stack1, stack2 := make([]int, 0, n), make([]int, 0, n)

	for i := 0; i < n; i++ {
		for len(stack1) > 0 && arr[stack1[len(stack1)-1]] > arr[i] {
			stack1 = stack1[:len(stack1)-1]
		}
		if len(stack1) > 0 {
			left[i] = int64(i - stack1[len(stack1)-1])
		} else {
			left[i] = int64(i + 1)
		}

		stack1 = append(stack1, i)
	}

	for i := n - 1; i >= 0; i-- {
		for len(stack2) > 0 && arr[stack2[len(stack2)-1]] >= arr[i] {
			stack2 = stack2[:len(stack2)-1]
		}
		if len(stack2) > 0 {
			right[i] = int64(stack2[len(stack2)-1] - i)
		} else {
			right[i] = int64(n - i)
		}

		stack2 = append(stack2, i)
	}

	var ans int64 = 0
	for i := 0; i < n; i++ {
		ans = (ans + int64(arr[i])*left[i]*right[i]) % mod
	}

	return int(ans)
}
