// Solved by @kitanoyoru
// https://leetcode.com/problems/repeated-substring-pattern/

const repeatedSubstringPattern = (s: string): boolean => {
  for (let i = 0; i < Math.floor(s.length / 2); i++) {
    let count = i + 1;
    if (s.length % count != 0) {
      continue;
    }
    let flag = true;
    for (let k = count; k + count <= s.length && flag; k += count) {
      for (let j = 0; j <= i && flag; j++) {
        if (s[j] != s[k+j]) {
          flag = false;
        }
      }
    }
    if (flag) {
      return true;
    }
  }
  return false;
}

console.log(repeatedSubstringPattern("abcabcabcabc"));