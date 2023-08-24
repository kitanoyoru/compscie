// Solved by @kitanoyoru
// https://binarysearch.com/problems/Word-Formation
class Solution {
  solve(words: Array<string>, letters: string): number {
    let m = new Map<string, number>(),
      ans = 0

    const check = (word: string) => {
      for (let char of letters) {
        m.set(char, 1)
      }
      for (let char of word) {
        if (!m.get(char)) return false
        m.set(char, m.get(char)! - 1)
      }
      return true
    }

    for (let word of words) {
      if (check(word)) {
        console.log(word)
        ans = Math.max(ans, word.length)
      }
    }

    return ans
  }
}

let s = new Solution()

console.log(
  s.solve(
    ["credit", "nirvana", "karma", "empathy", "hang", "aaaaaaaaa"],
    "afnvlfkm"
  )
)
export {}
