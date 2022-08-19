// Solved by @kitanoyoru
// https://leetcode.com/problems/single-number/

const singleNumber = (nums: number[]): number => {
  return nums.reduce((p, c) => p ^ c, 0)
}
