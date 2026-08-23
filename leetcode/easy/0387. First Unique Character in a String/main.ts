// Solved by @kitanoyoru
// https://leetcode.com/problems/first-unique-character-in-a-string/

interface HashMap {
  [key: string]: number
}

const firstUniqChar = (s: string): number => {
  let hm: HashMap = {}

  for (const ch of s) {
    if (hm[ch]) {
      hm[ch]++
    } else {
      hm[ch] = 1
    }
  }

  for (let i = 0; i < s.length; i++) {
    if (hm[s[i]] == 1) {
      return i
    }
  }

  return -1
}
