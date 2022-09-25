// Solved by @kitanoyoru
// https://leetcode.com/problems/jump-game/

const canJump = (nums: number[]): boolean => {
  const n = nums.length

  const dp = new Array<boolean>(n)
  dp[0] = true

  for (let i = 0; i < n; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (dp[j] && j + nums[j] >= i) {
        dp[i] = true
        break
      }
    }
  }

  return dp[n - 1]
}
