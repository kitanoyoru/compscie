// Solved by @kitanoyoru
// https://leetcode.com/problems/contains-duplicate/

const containsDuplicate = (nums: number[]): boolean => {
  return !(new Set(nums).size == nums.length)
}
