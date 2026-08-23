// Solved by @kitanoyoru
// https://leetcode.com/problems/permutations/

const permute = (nums: number[]): number[][] => {
  let ans: number[][] = []
  let visited: boolean[] = new Array(nums.length).fill(false)

  const dfs = (cur: number[]) => {
    if (cur.length == nums.length) {
      ans.push([...cur])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (visited[i] == false) {
        visited[i] = true
        cur.push(nums[i])
        dfs(cur)
        cur.pop()
        visited[i] = false
      }
    }
  }

  dfs([])

  return ans
}
