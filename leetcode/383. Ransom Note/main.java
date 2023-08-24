// Solved by @kitanoyoru
// https://leetcode.com/problems/ransom-note/

class Solution {
  public boolean canConstruct(String ransomNote, String magazine) {
    int[] count = new int[26];
    
    for (var ch : magazine.toCharArray()) {
      count[(int)ch-97]++;
    }
    
    for (var ch : ransomNote.toCharArray()) {
      int i = (int)ch-97;
      if (count[i] <= 0) {
        return false;
      } else {
        count[i]--;
      }
    }

    return true;
  }
}

