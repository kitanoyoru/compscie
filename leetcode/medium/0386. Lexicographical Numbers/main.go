// Solved by @kitanoyoru
// https://leetcode.com/problems/lexicographical-numbers/

func dfs(curr int, n *int, ans *[]int) {
	if curr > *n {
		return
	}

	*ans = append(*ans, curr)
	for i := 0; i < 10; i++ {
		dfs(curr*10+i, n, ans)
	}
}

func lexicalOrder(n int) []int {
	var ans []int = []int{}

	for i := 1; i < 10; i++ {
		dfs(i, &n, &ans)
	}

	return ans
}
