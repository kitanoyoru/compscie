// Solved by @kitanoyoru
// https://binarysearch.com/problems/Leaderboard

// time limit problem
class Solution {
  solve(nums: Array<number>): Array<number> {
    let uniqueSortedNums = [...new Set(nums)].sort((a, b) => b - a)
    return nums.map((v) => uniqueSortedNums.indexOf(v))
  }
}

let s = new Solution()
console.log(s.solve([50, 30, 50, 90, 10]))

export {}
