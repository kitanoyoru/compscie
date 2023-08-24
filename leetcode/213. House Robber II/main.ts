// Solved by @kitanoyoru
// https://leetcode.com/problems/house-robber-ii/

const robArr = (arr: number[]) => {
  let prev1 = 0,
    prev2 = 0

  for (const num of arr) {
    const temp = prev1
    prev1 = Math.max(prev2 + num, prev1)
    prev2 = temp
  }

  return prev1
}

const rob = (nums: number[]): number => {
  if (nums.length < 2) {
    return nums[0]
  }
  const arr1 = nums.slice(1, nums.length)
  const arr2 = nums.slice(0, nums.length - 1)

  return Math.max(robArr(arr1), robArr(arr2))
}
