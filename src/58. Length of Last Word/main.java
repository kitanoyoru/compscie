// Solved by @kitanoyoru
// https://leetcode.com/problems/length-of-last-word

class Solution {
  public int lengthOfLastWord(String s) {
    String[] words = s.split(" ");
    return words[words.length - 1].length();
  }
}
