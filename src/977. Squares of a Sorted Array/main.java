// Solved by @kitanoyoru
// https://leetcode.com/problems/squares-of-a-sorted-array/

class Solution {
    public int[] sortedSquares(int[] nums) {
      int[] sortedSquaresNums = new int[nums.length];       

      int lp = 0;
      int rp = nums.length - 1;

      for (var i = rp; i >= 0; i--) {
        if (Math.abs(nums[lp]) > nums[rp]) {
          sortedSquaresNums[i] = nums[lp] * nums[lp++] ;
          continue;
        }
        sortedSquaresNums[i] = nums[rp] * nums[rp--];
      }

      return sortedSquaresNums;
    }
}
