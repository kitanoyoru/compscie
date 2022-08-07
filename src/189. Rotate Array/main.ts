// Solved by @kitanoyoru
// https://leetcode.com/problems/rotate-array/

/**
 Do not return anything, modify nums in-place instead.
 */
const rotate = (nums: number[], k: number): void => {
  k %= nums.length
  const temp = nums.splice(nums.length - k, k)
  nums.unshift(...temp)
}
