// Solved by @kitanoyoru

package main

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func canJump(nums []int) bool {
	maxJump := 0
	for i := 0; i <= maxJump; i++ {
		maxJump = max(maxJump, i+nums[i])
		if maxJump >= len(nums)-1 {
			return true
		}
	}

	return false
}
