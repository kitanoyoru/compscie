// Solved by @kitanoyoru
// https://leetcode.com/problems/house-robber/

class Solution {
  public int rob(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;

    int prev1 = 0, prev2 = 0;

    for (int num : nums) {
      int temp = prev1;
      prev1 = Math.max(prev2 + num, prev1);
      prev2 = temp;
    }
   
    return prev1;
  }
}
