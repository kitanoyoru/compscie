// Solved by @kitanoyoru
// https://leetcode.com/problems/generate-parentheses/

const generateParenthesis = (n: number): string[] => {
  const ans: string[] = []
  const max = n * 2

  const dfs = (arr: string[], size: number, open: number, close: number) => {
    if (size == max) {
      if (open == close) {
        ans.push(arr.join(""))
      }
      return
    } else {
      if (close == 1) {
        close--
        open--
      }
      if (open < 0) {
        return
      }
      if (size == 0) {
        arr[size] = "("
        dfs(arr, size + 1, open + 1, close)
      } else {
        arr[size] = "("
        dfs(arr, size + 1, open + 1, close)
        arr[size] = ")"
        dfs(arr, size + 1, open, close + 1)
      }
    }
  }

  dfs([], 0, 0, 0)
  return ans
}
