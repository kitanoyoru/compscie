// Solved by @kitanoyoru
// https://leetcode.com/problems/multiply-strings/

const multiply = (num1: string, num2: string): string => {
  return (BigInt(num1) * BigInt(num2)).toString()
}

console.log(multiply("123456789", "987654321"))
