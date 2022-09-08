// Solved by @kitanoyoru
// https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/

const minRemoveToMakeValid = (s: string): string => {
  const st: number[] = []

  for (let i = 0; i < s.length; i++) {
    const chCode = s[i].charCodeAt(0)
    if (chCode >= 97 && chCode <= 122) continue
    if (chCode == 40) st.push(i)
    else if (s.length && chCode == 41) {
      if (s[st[st.length - 1]] == "(") st.pop()
      else st.push(i)
    }
  }

  console.log(s)

  let ans = ""
  for (let i = 0; i < s.length; i++) {
    if (!st.includes(i)) {
      ans += s[i]
    }
  }

  return ans
}
