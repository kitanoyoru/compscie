// Solved by @kitanoyoru
// https://leetcode.com/problems/3sum/

const threeSum = (nums: number[]): number[][] => {
  let ans: number[][] = []

  nums.sort((a, b) => a - b)

  const dfs = (cur: number[], index: number, sum: number) => {
    if (cur.length == 3) {
      if (!sum) {
        ans.push([...cur])
      }
      return
    }
    for (let i = index; i < nums.length; i++) {
      if (i > index && nums[i] == nums[i - 1]) {
        continue
      }
      sum += nums[i]
      cur.push(nums[i])
      dfs(cur, i + 1, sum)
      sum -= cur.pop()!
    }
  }

  dfs([], 0, 0)

  return ans
}

export {}
