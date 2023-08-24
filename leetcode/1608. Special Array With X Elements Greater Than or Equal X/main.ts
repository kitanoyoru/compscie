// Solved by @kitanoyoru
// https://leetcode.com/problems/special-array-with-x-elements-greater-than-or-equal-x/

const specialArray = (nums: number[]): number => {
  if (!nums.length) {
    return 0
  }
  let counter
  for (let num = 1; num <= nums.length; num++) {
    counter = 0
    for (let val of nums) {
      if (val >= num) {
        counter++
      }
    }
    if (counter == num) {
      return num
    }
  }

  return -1
}
