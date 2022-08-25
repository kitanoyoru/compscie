// Solved by @kitanoyoru
// https://leetcode.com/problems/add-strings/

const addStrings = (num1: string, num2: string): string => {
  const num1l = num1.length,
    num2l = num2.length

  let carry = 0,
    sum = 0,
    i = num1l - 1,
    j = num2l - 1
  let ans = []

  while (i >= 0 || j >= 0) {
    sum = carry
    if (i >= 0) sum += parseInt(num1[i--])
    if (j >= 0) sum += parseInt(num2[j--])
    ans.unshift(sum % 10)
    carry = Math.floor(sum / 10)
  }

  if (carry) {
    ans.unshift(carry)
  }

  return ans.join("")
}
