package main

/*
numTrees[4] = numTrees[0] * numTrees[3] +
							numTrees[1] * numTrees[2] +
							numTrees[2] * numTrees[1] +
							numTrees[0] * numTrees[3]

numTrees[2] = numTrees[0] * numTrees[1] +
							numTrees[1] * numTrees[0]
*/

func numTrees(n int) int {
	dp := make([]int, n+1)
	dp[0], dp[1] = 1, 1

	for i := 2; i <=n; i++ {
		total := 0
		for j := 1; j <= i; j++ {
			total += dp[j-1] * dp[i-j]
		} 
		dp[i] = total
	}

	return dp[n]
}
