// Solved by @kitanoyoru
// https://leetcode.com/problems/permutation-in-string/

class Solution {
  private boolean check(int[] hm1, int[] hm2) {
    for (int i = 0; i < 26; i++) {
      if (hm1[i] != hm2[i]) {
        return false;
      }
    }
    
    return true;
  }

  public boolean checkInclusion(String s1, String s2) {
    int[] hm_1 = new int[26];
    int[] hm_2 = new int[26];

    int s1l = s1.length();
    int s2l = s2.length();

    for (int i = 0; i < 26; i++) {
      hm_1[i] = hm_2[i] = 0;
    }

    for (int i = 0; i < s1l; i++) {
      hm_1[(int)s1.charAt(i) - 97]++;
    }

    int i = 0, j = 0;

    while (j < s2l) {
      hm_2[(int)s2.charAt(j) - 97]++;
      if (j - i + 1 == s1l) {
        if (this.check(hm_1, hm_2)) {
          return true;
        }
      }
      if (j - i + 1 < s1l) {
        j++;
      } else {
        hm_2[(int)s2.charAt(i) - 97]--;
        i++;
        j++;
      }
    }

    return false;
  }
}
