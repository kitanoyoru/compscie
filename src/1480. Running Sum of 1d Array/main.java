// Solved by @kitanoyoru
// https://leetcode.com/problems/running-sum-of-1d-array/submissions/

class Solution {
  public int[] runningSum(int[] nums) {
    int size = nums.length;
    for (let i = 1; i < size; i++) {
      nums[i] = nums[i] + nums[i-1];
    }
    
    return nums;
  }
}
