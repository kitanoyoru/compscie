// Solved by @kitanoyoru
// https://leetcode.com/problems/search-in-rotated-sorted-array/

class Solution {
  public int search(int[] nums, int target) {
    int start = 0, mid, end = nums.length - 1;

    while (start <= end) {
      mid = start + (end - start) / 2;
      if (nums[mid] < nums[end]) {
        end = mid;
      } else {
        start = mid + 1;
      }
    }
    
    int temp = end;
    start = 0;
    end = nums.length - 1;

    if (target >= nums[temp] && target <= nums[end]) {
      start = temp;
    } else {
      end = temp;
    }

    while (start <= end) {
      mid = start + (end - start) / 2;
      if (nums[mid] == target) {
        return mid;
      }
      if (nums[mid] < target) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    
    return -1;
  }
}
