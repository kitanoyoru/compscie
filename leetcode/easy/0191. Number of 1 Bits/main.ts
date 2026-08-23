// Solved by @kitanoyoru
// https://leetcode.com/problems/number-of-1-bits/

const hammingWeight = (n: number) => {
  return n
    .toString(2)
    .split("")
    .reduce((prev, curr) => prev + Number(curr), 0)
}
