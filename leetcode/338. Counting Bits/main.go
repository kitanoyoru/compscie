package main

func countBits(n int) []int {
	ans := make([]int, n+1)

	for i := 0; i < n+1; i++ {
		if i%2 == 0 {
			ans[i] = ans[i/2]
		} else {
			ans[i] = ans[i/2] + 1
		}
	}

	return ans
}
