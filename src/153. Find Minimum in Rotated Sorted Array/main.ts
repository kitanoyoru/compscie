// Solved by @kitanoyoru
// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/

const findMin = (nums: number[]): number => {
  let start = 0,
    end = nums.length - 1,
    mid: number
  while (start <= end) {
    mid = start + Math.floor((end - start) / 2)
    if (nums[mid] < nums[end]) {
      end = mid
    } else {
      start = mid + 1
    }
  }

  return nums[end]
}
