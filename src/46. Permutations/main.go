package main

func permute(nums []int) [][]int {
	n := len(nums)

	ans := [][]int{}
	visited := make(map[int]bool, n)

	var dfs func([]int)
	dfs = func(path []int) {
		if len(path) == n {
			temp := make([]int, len(nums))
			copy(temp, nums)
			ans = append(ans, temp)
			return
		}

		for i, num := range nums {
			if val, _ := visited[i]; !val {
				visited[i] = true
				path = append(path, num)
				dfs(path)
				path = path[:len(path)-1]
				visited[i] = false
			}
		}
	}

	dfs([]int{})

	return ans
}
