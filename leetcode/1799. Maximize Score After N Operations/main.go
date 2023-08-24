package main

func gcd(a, b int) int {
	if b == 0 {
		return a
	}
	return gcd(b, a%b)
}

func maxScore(nums []int) int {
	dp := make([]int, 1<<len(nums))
	for i := 0; i < len(dp); i++ {
		dp[i] = -1
	}

	return dfs(nums, dp, 0, 0)
}

func dfs(nums []int, dp []int, mask, pairsPicked int) int {
	if 2*pairsPicked == len(nums) {
		return 0
	}

	if dp[mask] != -1 {
		return dp[mask]
	}

	maxScore := 0

	for i := 0; i < len(nums); i++ {
		for j := i + 1; j < len(nums); j++ {
			if (((mask >> i) & 1) == 1) || (((mask >> j) & 1) == 1) {
				continue
			}

			newMask := mask | (1 << i) | (1 << j)

			currScore := (pairsPicked + 1) * gcd(nums[i], nums[j])
			remainingScore := dfs(nums, dp, newMask, pairsPicked+1)

			if currScore+remainingScore > maxScore {
				maxScore = currScore + remainingScore
			}
		}
	}

	dp[mask] = maxScore

	return maxScore
}
