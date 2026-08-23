// 9. Palindrome Number solved by @kitanoyoru
// https://leetcode.com/problems/palindrome-number/

const isPalindrome = (x: number): boolean => {
  return (
    Number(
      Array.from(x.toString())
        .reverse()
        .reduce((prev, curr) => prev + curr, "")
    ) == x
  )
}

console.log(isPalindrome(-121))
