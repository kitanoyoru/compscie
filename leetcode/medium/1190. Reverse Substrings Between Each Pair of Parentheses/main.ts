const reverseParentheses = (s: string): string => {
  let stack: Array<string> = []
  let current = ""

  for (let i = 0; i < s.length; i++) {
    if (s[i] == "(") {
      stack.push(current)
      current = ""
    } else if (s[i] == ")") {
      current = stack.pop() + current.split("").reverse().join("")
    } else {
      current += s[i]
    }
  }

  return current
}
