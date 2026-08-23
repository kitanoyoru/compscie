// Solved by @kitanoyoru
// https://leetcode.com/problems/backspace-string-compare/

const helper = (s: string) => {
  let str: string[] = []
  let backspaces = 0

  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] == "#") {
      backspaces++
      continue
    }
    if (backspaces > 0) {
      backspaces--
      continue
    }
    str.push(s[i])
  }

  return str.reverse().join("")
}

const backspaceCompare = (s: string, t: string): boolean => {
  return helper(s) == helper(t)
}

export {}
