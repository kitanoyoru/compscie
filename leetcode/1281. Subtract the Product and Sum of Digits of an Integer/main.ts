// Solved by @kitanoyoru
// https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/

const subtractProductAndSum = (n: number): number => {
  const digitsArr = n
    .toString()
    .split("")
    .map((v) => Number(v))
  return (
    digitsArr.reduce((p, c) => p * c, 1) - digitsArr.reduce((p, c) => p + c, 0)
  )
}
