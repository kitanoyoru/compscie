// Solved by @kitanoyoru
// https://leetcode.com/problems/evaluate-reverse-polish-notation/

const action = (firstOp: string, temp: string, lastOp: string) => {
  switch (temp) {
    case "+":
      console.log(firstOp, lastOp)
      return String(parseInt(firstOp) + parseInt(lastOp))
    case "-":
      return String(parseInt(firstOp) - parseInt(lastOp))
    case "/":
      return String(parseInt(firstOp) / parseInt(lastOp))
    case "*":
      return String(parseInt(firstOp) * parseInt(lastOp))
  }
}

const evalRPN = (tokens: string[]) => {
  let stack: string[] = []

  for (let i = 0; i < tokens.length; i++) {
    if (Number(tokens[i])) {
      stack.push(tokens[i])
    } else {
      let lastOp = stack.pop()!
      let firstOp = stack.pop()!
      console.log(firstOp, tokens[i], lastOp)
      stack.push(action(firstOp, tokens[i], lastOp)!)
    }
  }

  return stack[0]
}

console.log(evalRPN(["4", "-2", "/", "2", "-3", "-", "-"]))
console.log(evalRPN(["4", "13", "5", "/", "+"]))
