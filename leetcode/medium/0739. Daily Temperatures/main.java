// Solved by @kitanoyoru
// https://leetcode.com/problems/daily-temperatures/?envType=study-plan&id=programming-skills-ii

import java.util.Arrays;

class Solution {
  public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length, day = 0;
    int[] ans = new int[n];

    Arrays.fill(ans, 0);

    for (int i = 0; i < n; i++) {
      day = 0;
      for (int j = i + 1; j < n; j++) {
        if (temperatures[j] > temperatures[i]) {
          ans[i] = j - i;
          break;
        }
      }
    }

    return ans;
  }
}
