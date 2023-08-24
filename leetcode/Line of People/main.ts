// Solved by @kitanoyoru
// https://binarysearch.com/problems/Line-of-People

class Solution {
  solve(n: number, a: number, b: number): number {
    return Math.min(b + 1, n - a)
  }
}
