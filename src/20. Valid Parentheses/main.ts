// Solved by @kitanoyoru
// https://leetcode.com/problems/valid-parentheses/

const isValid = (s: string): boolean => {
  let st: string[] = []

  for (let i = 0; i < s.length; i++) {
    if (s[i] == "(" || s[i] == "{" || s[i] == "[") {
      st.push(s[i])
    } else {
      let open = st.pop()
      if (
        (open == "(" && s[i] == ")") ||
        (open == "[" && s[i] == "]") ||
        (open == "{" && s[i] == "}")
      ) {
        continue
      } else {
        return false
      }
    }
  }

  return !st.length ? true : false
}

console.log(isValid("{[}]"))
