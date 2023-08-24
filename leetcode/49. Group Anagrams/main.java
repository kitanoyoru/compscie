// Solved by @kitanoyoru
// https://leetcode.com/problems/group-anagrams/

import java.util.*;

class Solution {
  public List<List<String>> groupAnagrams(String[] strs) {
    if (strs.length == 0) {
      return new ArrayList<>();
    }

    HashMap<String, ArrayList<String>> hm = new HashMap<>();

    for (String s : strs) {
      char[] sarr = s.toCharArray();
      Arrays.sort(sarr);
      String temp = String.valueOf(sarr);

      if (hm.containsKey(temp)) {
        hm.get(temp).add(s);
      } else {
        ArrayList<String> l = new ArrayList<>();
        l.add(s);
        hm.put(temp, l);
      }
    }

    return new ArrayList<>(hm.values());
  }
}
