// Solved by @kitanoyoru
// https://leetcode.com/problems/repeated-substring-pattern/submissions/

class Solution {
  public boolean repeatedSubstringPattern(String s) {
    for (int i = 0; i < s.length() / 2; i++) {
      int count = i + 1;
      if (s.length() % count != 0) {
        continue;
      }
      boolean flag = true;
      for (int k = count; k + count <= s.length() && flag; k += count) {
        for (int j = 0; j <= i && flag; j++) {
          if (s.charAt(j) != s.charAt(j + k)) {
            flag = false;
          }
        }
      }
      if (flag == true) {
        return true;
      }
    } 
    return false;
  }
}