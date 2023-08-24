// Solved by @kitanoyoru
// https://leetcode.com/problems/search-insert-position/submissions/

class Solution {
    public int searchInsert(int[] nums, int target) {
      int start = 0, end = nums.length - 1;

      while (start <= end) {
        int mid = start + (end - start) / 2;
        if (target == nums[mid]) {
          return mid;
        } else if (target > nums[mid]) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }

      return start;
    }
}
