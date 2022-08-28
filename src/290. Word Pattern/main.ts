// Solved by @kitanoyoru
// https://leetcode.com/problems/word-pattern/

const wordPattern = (pattern: string, s: string): boolean => {
  const patternMap = new Map<string, string>()
  const wordsMap = new Map<string, string>()
  const patternLen = pattern.length
  const words = s.split(" ")

  if (patternLen != words.length) {
    return false
  }

  for (let i = 0; i < patternLen; i++) {
    const ch = pattern[i]
    const word = words[i]

    if (patternMap.has(ch)) {
      if (patternMap.get(ch) != word) {
        return false
      }
    } else {
      patternMap.set(ch, word)
    }

    if (wordsMap.has(word)) {
      if (wordsMap.get(word) != ch) {
        return false
      }
    } else {
      wordsMap.set(word, ch)
    }
  }

  return true
}
