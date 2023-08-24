// Solved by @kitanoyoru

package main

func climbStairs(n int) int {
	if n < 2 {
		return 1
	}

	a, b := 1, 1

	for i := 2; i <= n; i++ {
		temp := b
		b = a + b
		a = temp
	}

	return b
}
