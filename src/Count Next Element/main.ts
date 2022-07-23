// Solved by @kitanoyoru
// https://binarysearch.com/problems/Count-Next-Element

class Solution {
  solve(nums: Array<number>): number {
    const s = new Set(nums)
    let count = 0
    for (let val of nums) {
      if (s.has(val + 1)) {
        count++
      }
    }
    return count
  }
}
