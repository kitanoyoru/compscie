// Solved by @kitanoyoru
// https://leetcode.com/problems/longest-substring-without-repeating-characters/

interface HashMap {
  [key: string]: boolean
}

const lengthOfLongestSubstring = (s: string): number => {
  const n = s.length;

  let hm: HashMap = {};
  let maxLength = 0;
  let i = 0, j = 0;

  while (i < n && j < n) {
    if (!hm[s[j]]) {
      hm[s[j]] = true;
      j++;
      maxLength = Math.max(maxLength, j - i);
    } else {
      hm[s[i]] = false;
      i++;
    }
  }

  return maxLength;
};

console.log(lengthOfLongestSubstring("dvdf"))

export {}
