// Solved by @kitanoyoru
// https://leetcode.com/problems/squares-of-a-sorted-array/

// O(nlogn)
/*const sortedSquares = (nums: number[]): number[] => {
  return nums.map(v => v ** 2).sort((a, b) => a - b);
};*/

const sortedSquares = (nums: number[]): number[] => {
  let sortedSquaresNums: number[] = []

  let lp = 0,
    rp = nums.length - 1

  for (let i = rp; i >= 0; i--) {
    if (Math.abs(nums[lp]) < nums[rp]) {
      sortedSquaresNums[i] = nums[rp--] ** 2
      continue
    }
    sortedSquaresNums[i] = nums[lp++] ** 2
  }

  return sortedSquaresNums
}
