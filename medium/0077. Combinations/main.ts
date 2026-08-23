const combine = (n: number, k: number): number[][] => {
  let nums = [...Array(n).keys()].map((val) => val + 1)
  let ans: number[][] = []

  const dfs = (cur: number[], i: number) => {
    if (cur.length == k) {
      ans.push([...cur])
      return
    } else {
      for (let j = i; j < n; j++) {
        cur.push(nums[j])
        dfs(cur, j + 1)
        cur.pop()
      }
    }
  }

  dfs([], 0)

  return ans
}
