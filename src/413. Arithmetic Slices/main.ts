// Solved by @kitanoyoru
// https://leetcode.com/problems/arithmetic-slices/

const numberOfArithmeticSlices = (nums: number[]): number => {
  if (nums.length < 3) {
    return 0
  }

  let diff = 0,
    ans = 0

  for (let i = 0; i < nums.length - 2; i++) {
    diff = nums[i + 1] - nums[i]
    for (let j = i + 2; j < nums.length; j++) {
      if (nums[j] - nums[j - 1] == diff) {
        ans++
      } else {
        break
      }
    }
  }

  return ans
}
