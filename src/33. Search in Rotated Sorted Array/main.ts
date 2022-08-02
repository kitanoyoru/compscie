// Solved by @kitanoyoru
// https://leetcode.com/problems/search-in-rotated-sorted-array/

const search = (nums: number[], target: number): number => {
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

  let p = end
  console.log(p)
  start = 0
  end = nums.length - 1
  if (target >= nums[p] && target <= nums[end]) {
    start = p
  } else {
    end = p
  }

  while (start <= end) {
    mid = start + Math.floor((end - start) / 2)
    if (nums[mid] == target) {
      return mid
    } else if (nums[mid] < target) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return -1
}
