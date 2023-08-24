// Solved by @kitanoyoru
// https://leetcode.com/problems/next-greater-element-ii/

const nextGreaterElements = (nums: number[]): number[] => {
  let ans: number[] = []
  for (let i = 0; i < nums.length; i++) {
    let num = nums[i],
      pos = i + 1
    while (true) {
      if (nums[pos] > num) {
        ans.push(nums[pos])
        break
      } else if (pos == i) {
        ans.push(-1)
        break
      } else if (pos == nums.length) {
        pos = 0
      } else {
        pos++
      }
    }
  }

  return ans
}
