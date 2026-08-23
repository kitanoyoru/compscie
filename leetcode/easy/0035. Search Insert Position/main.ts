// Solved by @kitanoyoru
// https://leetcode.com/problems/search-insert-position/

const searchInsert = (nums: number[], target: number): number => {
  let start = 0,
    mid = 0,
    ans = 0,
    end = nums.length - 1

  while (start <= end) {
    mid = Math.floor(start + (end - start) / 2)
    if (nums[mid] == target) {
      return mid
    } else if (nums[mid] < target) {
      ans = mid + 1
      start = mid + 1
    } else {
      ans = mid
      end = mid - 1
    }
  }

  return ans
}
