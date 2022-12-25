// Solved by @kitanoyoru

package main

func digitsSquareSum(n int) int {
	var sum, rem int

	for sum = 0; n > 0; n = n / 10 {
		rem = n % 10
		sum = sum + rem*rem
	}

	return sum

}

func isHappy(n int) bool {
	hm := make(map[int]bool)
	isHappy := false

	var dfs func(int)
	dfs = func(n int) {
		sum := digitsSquareSum(n)

		if sum == 1 {
			isHappy = true
			return
		}

		if _, ok := hm[n]; ok == true {
			isHappy = false
			return
		} else {
			hm[n] = true
		}

		dfs(sum)
	}

	dfs(n)

	return isHappy
}
