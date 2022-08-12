// Solved by @kitanoyoru
// https://leetcode.com/problems/permutation-in-string/


const initMp = (s: string): Map<string, number> => {
  let mp = new Map<string, number>();

  for (const ch of s) {
    mp.set(ch, 1);
  }

  return mp;
};

const checkInclusion = (s1: string, s2: string): boolean => {
  const windowSize = s1.length;

  let mp = initMp(s1);
  let equal = windowSize;

  let i = 0, j = 0;

  while (j < s2.length) {
    if (mp.has(s2[j])) {
      mp.set(s2[j], mp.get(s2[j])! - 1);
      if (mp.get(s2[j]) == 0) {
        equal--;
      }
    }
    if (j - i + 1 < windowSize) {
      j++;
    } else if (j - i + 1 == windowSize) {
      console.log(equal)
      if (equal == 0) {
        return true;
      }
      if (mp.has(s2[i])) {
        mp.set(s2[i], mp.get(s2[i])! + 1);
        if (mp.get(s2[i]) == 1) {
          equal++;
        }
      }
      i++;
      j++;
    }
  }

  return false;
};

//console.log(checkInclusion("ab", "eidbaooo"));
//console.log(checkInclusion("ab", "eidboaoo"));
console.log(checkInclusion("abcdxabcde", "abcdeabcdx"));
