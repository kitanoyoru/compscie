// Solved by @kitanoyoru
// https://leetcode.com/problems/sum-of-square-numbers/

const judgeSquareSum = (c: number): boolean => {
  let start = 0,
    end = Math.floor(c ** (1 / 2)),
    mid: number

  while (start <= end) {
    mid = start ** 2 + end ** 2
    if (c === mid) {
      return true
    } else if (mid > c) {
      end--
    } else {
      start++
    }
  }

  return false
}

console.log(judgeSquareSum(5))
