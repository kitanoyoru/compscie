// Solved by @kitanoyoru
// https://leetcode.com/problems/find-all-anagrams-in-a-string/

import java.util.Arrays;

class Solution {
  public List<Integer> findAnagrams(String s, String p) {
    List<Integer> ans = new ArrayList<>();
    int strSize = s.length(), windowSize = p.length();

    if (strSize < windowSize) {
      return ans;
    }

    var windowFreq = initFreq(s.substring(0, windowSize));
    var pFreq = initFreq(p);

    if (isSame(windowFreq, pFreq)) {
      ans.add(0);
    }

    for (int i = windowSize; i < strSize; i++) {
      windowFreq[(int)s.charAt(i) - 97]++;
      windowFreq[(int)s.charAt(i-windowSize) - 97]--;
      if (isSame(windowFreq, pFreq)) {
        ans.add(i-windowSize+1);
      }
    }

    return ans;
  }

  public int[] initFreq(String s) {
    int[] freq = new int[26];
    Arrays.fill(freq, 0);
    for (int i = 0; i < s.length(); i++) {
      freq[(int)s.charAt(i) - 97]++;
    }

    return freq;
  }

  public boolean isSame(int[] arr1, int[] arr2) {
    for (int i = 0; i < 26; i++) {
      if (arr1[i] != arr2[i]) {
        return false;
      }
    }

    return true;
  }
}
