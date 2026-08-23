// Solved by @kitanoyoru
// https://leetcode.com/problems/reverse-string/

/**
 Do not return anything, modify s in-place instead.
 */
const reverseString = (s: string[]): void => {
  let start = 0,
    end = s.length - 1,
    temp: string

  while (start < end) {
    temp = s[start]
    s[start] = s[end]
    s[end] = temp
    start++
    end--
  }
}
