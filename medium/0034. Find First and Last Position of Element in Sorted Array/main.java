// Solved by @kitanoyoru
// https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/

class Solution {
  public int[] searchRange(int[] nums, int target) {
    if (nums.length == 0) {
      return new int[] {-1, -1};
    }
    int start = 0, end = nums.length - 1, mid;
    int[] ans = {-1, -1};
    
    while (start <= end) {
      mid = start + (end - start) / 2;
      if (nums[mid] == target) {
        ans[0] = mid;
        end = mid - 1;
      } else if (nums[mid] < target) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    start = 0;
    end = nums.length - 1;

    while (start <= end) {
      mid = start + (end - start) / 2;
      if (nums[mid] == target) {
        ans[1] = mid;
        start = mid + 1;
      } else if (nums[mid] < target) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return (ans[0] == -1 || ans[1] == -1) ? new int[] {-1, -1} : ans;
  }
}
