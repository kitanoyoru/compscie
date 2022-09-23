// Solved by @kitanoyoru
// https://leetcode.com/problems/add-binary/?envType=study-plan&id=programming-skills-ii

class Solution {
  public String addBinary(String a, String b) {
    if (a.charAt(0) == '0' && b.charAt(0) == '0') {
      return "0";
    }
    StringBuilder ans = new StringBuilder("");
    int i = a.length() - 1, j = b.length() - 1;
    int sum = 0;

    while (i >= 0 || j >= 0 || sum == 1) {
      sum += i >= 0 ? a.charAt(i) - '0' : 0;
      sum += j >= 0 ? b.charAt(j) - '0' : 0;

      ans.append((char)(sum % 2 + '0'));

      sum /= 2;

      i--;
      j--;
    }

    int start = ans.length() - 1;
    while (start >= 0 && ans.charAt(start) == '0') {
      start--;
    }

    if (start != ans.length() - 1) {
      ans.delete(start + 1, ans.length());
    }

    return ans.reverse().toString();
  }
}
