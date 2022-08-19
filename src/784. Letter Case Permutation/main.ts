const swapCase = (letter: string) => {
  if (letter == letter.toLowerCase()) {
    return letter.toUpperCase()
  } else {
    return letter.toLowerCase()
  }
}

const letterCasePermutation = (s: string): string[] => {
  let ans: string[] = []

  const dfs = (cur: string[], i: number) => {
    if (cur.length == s.length) {
      ans.push(cur.join(""))
      return
    } else {
      cur.push(s[i])
      dfs(cur, i + 1)
      cur.pop()
      if (s[i].match(/[a-z]/i)) {
        cur.push(swapCase(s[i]))
        dfs(cur, i + 1)
        cur.pop()
      }
    }
  }

  dfs([], 0)

  return ans
}

export {}
