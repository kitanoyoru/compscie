// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-search/

const search = (nums: number[], target: number): number => {
  let start = 0,
    end = nums.length - 1

  while (start <= end) {
    const mid = Math.floor((start + end) / 2)

    if (nums[mid] === target) {
      return mid
    } else if (target < nums[mid]) {
      end -= 1
    } else {
      start += 1
    }
  }
  return -1
}
