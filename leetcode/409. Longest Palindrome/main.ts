// Solved by @kitanoyoru
// https://leetcode.com/problems/longest-palindrome/

const longestPalindrome = (s: string): number => {
  let letters = new Map<string, number>()

  for (const letter of s) {
    if (letters.has(letter)) letters.set(letter, letters.get(letter)! + 1)
    else letters.set(letter, 1)
  }

  let even = 0

  for (const val of letters.values()) {
    if (val != 1) {
      even += 2 * Math.floor(val / 2)
    }
  }

  return even == s.length ? even : even + 1
}
