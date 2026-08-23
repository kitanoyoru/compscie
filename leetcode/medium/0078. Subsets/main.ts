// Solved by @kitanoyoru
// https://leetcode.com/problems/subsets/

const subsets = (nums: number[]): number[][] => {
  const ans: number[][] = [[]]
  const dfs = (set: number[], idx: number) => {
    if (set.length === nums.length) {
      return
    }
    for (let i = idx; i < nums.length; i++) {
      set.push(nums[i])
      ans.push([...set])
      dfs(set, i + 1)
      set.pop()
    }
  }

  dfs([], 0)

  return ans
}
