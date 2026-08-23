package main

func combine(n int, k int) [][]int {
	ans := [][]int{}

	var dfs func([]int, int)
	dfs = func(path []int, prev int) {
		if len(path) == k {
			temp := make([]int, k)
			copy(temp, path)
			ans = append(ans, temp)
		}

		for i := prev; i <= n; i++ {
			path = append(path, i)
			dfs(path, i+1)
			path = path[:len(path)-1]
		}
	}

	dfs([]int{}, 1)

	return ans
}
