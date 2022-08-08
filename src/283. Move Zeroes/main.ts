// Solved by @kitanoyoru
// https://leetcode.com/problems/move-zeroes/

/**
 Do not return anything, modify nums in-place instead.
 */
const moveZeroes = (nums: number[]): void => {
  for (let i = 0, j = nums.length - 1; i <= j; ) {
    if (!nums[i]) {
      nums.splice(i, 1)
      nums.push(0)
      j--
    } else {
      i++
    }
  }
}
