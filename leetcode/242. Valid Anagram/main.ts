// Solved by @kitanoyoru
// https://leetcode.com/problems/valid-anagram/

interface HashMap {
  [key: string]: number
}

const isAnagram = (s: string, t: string): boolean => {
  if (s.length != t.length) {
    return false
  }

  let hm: HashMap = {}

  for (let ch of t) {
    if (hm[ch]) {
      hm[ch]++
    } else {
      hm[ch] = 1
    }
  }

  for (let ch of s) {
    if (hm[ch]) {
      hm[ch]--
    } else {
      return false
    }
  }

  return true
}
