// Solved by @kitanoyoru
// https://leetcode.com/problems/power-of-three/submissions/

const isPowerOfThree = (n: number): boolean => {
  return n > 0 && !(1162261467 % n)
}
