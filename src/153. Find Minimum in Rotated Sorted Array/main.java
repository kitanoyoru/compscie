// Solved by @kitanoyoru
// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/

class Solution {
  public int findMin(int[] nums) {
    int start = 0, mid, end = nums.length - 1;
    
    while (start <= end) {
      mid = start + (end - start) / 2;
      if (nums[mid] < nums[end]) {
        end = mid;
      } else {
        start = mid + 1;
      }
    }

    return nums[end];
  }
}
