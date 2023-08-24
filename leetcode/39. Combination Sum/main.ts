// Solved by @kitanoyoru
// https://leetcode.com/problems/combination-sum/

const combinationSum = (candidates: number[], target: number): number[][] => {
  const ans: number[][] = []
  const dfs = (arr: number[], idx: number, sum: number) => {
    if (idx == candidates.length) return
    if (sum > target) return

    if (sum == target) {
      ans.push(arr)
      return
    }

    dfs([...arr, candidates[idx]], idx, sum + candidates[idx])
    dfs(arr, idx + 1, sum)
  }

  dfs([], 0, 0)

  return ans
}
