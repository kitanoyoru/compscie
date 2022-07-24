// Solved by @kitanoyoru
// https://leetcode.com/problems/monotonic-array/submissions/

class Solution {
  public boolean isMonotonic(int[] nums) {
    int incCount = 0, decrCount = 0;

    for (int i = 1; i < nums.length; i++) {
      if (nums[i] < nums[i-1]) {
        incCount++;
      } else if (nums[i] > nums[i-1]) {
        decrCount++;
      }
    }

    return !((incCount != 0 ? true : false) && (decrCount != 0 ? true : false));
  }
}