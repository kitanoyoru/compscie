// Solved by @kitanoyoru
// https://leetcode.com/problems/majority-element/

const majorityElement = (nums: number[]): number => {
  let cand = nums[0],
    count = 1
  for (let i = 1; i < nums.length; i++) {
    if (!count) {
      cand = nums[i]
    }
    count += cand == nums[i] ? 1 : -1
  }

  return cand
}
