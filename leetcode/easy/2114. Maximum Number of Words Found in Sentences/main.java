// Solved by @kitanoyoru
// https://leetcode.com/problems/maximum-number-of-words-found-in-sentences/

class Solution {
  public int mostWordsFound(String[] sentences) {
    int maxValue = Integer.MIN_VALUE, temp;
    for (var s : sentences) {
      temp = s.split(" ").length;
      maxValue = temp > maxValue ? temp : maxValue;
    }

    return maxValue;
  }
}
