// Solved by @kitanoyoru
// https://leetcode.com/problems/arithmetic-slices/

class Solution {
  public int numberOfArithmeticSlices(int[] nums) {
    if (nums.length == 0) {
      return 0;
    }

    int diff = 0, ans = 0;

    for (int i = 0; i < nums.length - 2; i++) {
      diff = nums[i+1] - nums[i];
      for (int j = i + 2; j < nums.length; j++) {
        if (nums[j] - nums[j-1] == diff) {
          ans++;
        } else {
          break;
        }
      }
    }

    return ans;
  }
}
