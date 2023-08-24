// Solved by @kitanoyoru
// https://leetcode.com/problems/count-odd-numbers-in-an-interval-range/

const countOdds = (low: number, high: number): number => {
  let count = 0
  while (low != high + 1) {
    if (low % 2 == 1) {
      count++
    }
    low++
  }

  return count
}
