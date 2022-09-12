// Solved by @kitanoyoru
// https://leetcode.com/problems/fibonacci-number/

const fib = (n: number): number => {
  return Math.round(((1 + Math.sqrt(5)) / 2) ** n) / Math.sqrt(5)
}
