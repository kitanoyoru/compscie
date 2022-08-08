// Solved by @kitanoyoru
// https://leetcode.com/problems/find-all-anagrams-in-a-string/

const ASCII_CODE_OF_A = 97
const LEN_ENG_ALPHABET = 26

const findAnagrams = (s: string, p: string): number[] => {
  let ans: number[] = [],
    sL = s.length,
    pL = p.length

  if (sL < pL) {
    return []
  }

  let parr = initFreq(p),
    sarr = initFreq(s.slice(0, pL))

  if (isSame(parr, sarr)) {
    ans.push(0)
  }

  for (let i = pL; i < sL; i++) {
    sarr[s[i].charCodeAt(0) - ASCII_CODE_OF_A]++
    sarr[s[i - pL].charCodeAt(0) - ASCII_CODE_OF_A]--

    if (isSame(parr, sarr)) {
      ans.push(i - pL + 1)
    }
  }

  return ans
}

const initFreq = (s: string): number[] => {
  let arr = new Array(LEN_ENG_ALPHABET).fill(0)
  for (const c of s) {
    arr[c.charCodeAt(0) - ASCII_CODE_OF_A]++
  }

  return arr
}

const isSame = (parr: number[], sarr: number[]) => {
  for (let i = 0; i < LEN_ENG_ALPHABET; i++) {
    if (parr[i] != sarr[i]) {
      return false
    }
  }

  return true
}
