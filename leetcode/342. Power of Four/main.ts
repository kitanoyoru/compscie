// Solved by @kitanoyoru
// https://leetcode.com/problems/power-of-four/

const isPowerOfFour = (n: number): boolean => {
  return n > 0 && !(n & (n - 1)) && !!(n & 1431655765)
}
