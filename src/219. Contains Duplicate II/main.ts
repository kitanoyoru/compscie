// Solved by @kitanoyoru
// https://leetcode.com/problems/contains-duplicate-ii/

const containsNearbyDuplicate = (nums: number[], k: number): boolean => {
  const set = new Set()

  for (let i = 0; i < nums.length; i++) {
    if (i > k) set.delete(nums[i - k - 1])
    if (set.has(nums[i])) return true
    else set.add(nums[i])
  }

  return false
}
