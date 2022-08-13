// Solved by @kitanoyoru
// https://leetcode.com/problems/substring-with-concatenation-of-all-words/

interface HashMap {
  [key: string]: number
}

const initHm = (words: string[]): HashMap => {
  let hm: HashMap = {}
  for (const word of words) {
    if (hm[word]) {
      hm[word]++
    } else {
      hm[word] = 1
    }
  }

  return hm
}

const checkSbstr = (s: string, hm: HashMap, wordLen: number) => {
  for (let j = 0; j < s.length; j += wordLen) {
    let word = s.slice(j, j + wordLen)
    if (!hm[word]--) {
      return false
    }
  }

  return true
}

const findSubstring = (s: string, words: string[]): number[] => {
  const sLen = s.length
  const wordsSize = words.length
  const wordLen = words[0].length
  const windowSize = wordsSize * wordLen

  let ans: number[] = []

  for (let i = 0; i + windowSize <= sLen; i++) {
    let hm = initHm(words)
    let sbstr = s.slice(i, i + windowSize)
    if (checkSbstr(sbstr, hm, wordLen)) {
      ans.push(i)
    }
  }

  return ans
}
