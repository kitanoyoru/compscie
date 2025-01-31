package main

import "math"

func grayCode(n int) []int {
	result := []int{0}

	visited := make(map[int]struct{})
	visited[0] = struct{}{}

	var backtrack func(num int) bool
	backtrack = func(num int) bool {
		if len(result) == int(math.Pow(2, float64(n))) {
			return true
		}

		for i := 0; i < n; i++ {
			next := num ^ (1 << i)

			if _, ok := visited[next]; !ok {
				result = append(result, next)
				visited[next] = struct{}{}

				if backtrack(next) {
					return true
				}

				result = result[:len(result)-1]
				delete(visited, next)
			}
		}

		return false
	}

	backtrack(0)

	return result
}
