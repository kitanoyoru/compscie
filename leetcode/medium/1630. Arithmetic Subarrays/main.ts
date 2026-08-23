// Solved by @kitanoyoru
// https://leetcode.com/problems/arithmetic-subarrays/

const checkArithmetic = (arr: number[]): boolean => {
  arr.sort((a, b) => a - b)
  let d = arr[1] - arr[0]
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] != d) {
      return false
    }
  }
  return true
}

const checkArithmeticSubarrays = (
  nums: number[],
  l: number[],
  r: number[]
): boolean[] => {
  let ans: boolean[] = [],
    flag = true
  for (let i = 0; i < l.length; i++) {
    flag = checkArithmetic(nums.slice(l[i], r[i] + 1))
    ans.push(flag)
  }
  return ans
}

console.log(checkArithmeticSubarrays([4, 6, 5, 9, 3, 7], [0, 0, 2], [2, 3, 5]))
