// Solved by @kitanoyoru
// https://leetcode.com/problems/length-of-last-word/

const lengthOfLastWord = (s: string): number => {
  return s.trim().split(" ").at(-1).length
}
