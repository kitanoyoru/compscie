// Sovled by @kitanoyoru
// https://leetcode.com/problems/power-of-two/

const isPowerOfTwo = (n: number): boolean => {
  return Number.isInteger(Math.log2(n))
}
