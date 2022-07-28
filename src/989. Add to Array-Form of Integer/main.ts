// Solved by @kitanoyoru
// https://leetcode.com/problems/add-to-array-form-of-integer/

const addToArrayForm = (num: number[], k: number): number[] => {
  return (BigInt(num.join("")) + BigInt(k))
    .toString()
    .split("")
    .map((v) => Number(v))
}
