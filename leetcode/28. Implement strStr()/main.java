// Solved by @kitanoyoru
// https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/

class Solution {
  public int strStr(String haystack, String needle) {
   int n = haystack.length(), m = needle.length();
    for (int i = 0;; i++) {
      for (int j = 0;; j++) {
        if (j == m) return i;
        if (i + j == n) return -1;
        if (needle.charAt(j) != haystack.charAt(i + j)) break;
      }
    }
  }
}
