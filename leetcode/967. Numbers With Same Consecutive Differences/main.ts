// Solved by @kitanoyoru
// https://leetcode.com/problems/numbers-with-same-consecutive-differences/

const numsSameConsecDiff = (n: number, k: number): number[] => {
  const ans: number[] = []

  const dfs = (arr: number[]) => {
    if (arr.length == n) {
      ans.push(parseInt(arr.reduce((p, c) => p + c, "")))
      return
    }
    for (let digit = 0; digit < 10; digit++) {
      if (Math.abs(arr[arr.length - 1] - digit) == k) {
        arr.push(digit)
        dfs(arr)
        arr.pop()
      }
    }
  }

  for (let i = 1; i < 10; i++) {
    dfs([i])
  }

  return ans
}
