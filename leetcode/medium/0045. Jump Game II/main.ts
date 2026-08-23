// Solved by @kitanoyoru
// https://leetcode.com/problems/jump-game-ii/

const jump = (nums: number[]): number => {
  let maxJump = 0,
    jumps = 0,
    curEnd = 0

  for (let i = 0; i < nums.length - 1; i++) {
    maxJump = Math.max(maxJump, i + nums[i])
    if (i == curEnd) {
      jumps++
      curEnd = maxJump
      if (curEnd >= nums.length - 1) {
        break
      }
    }
  }

  return jumps
}
