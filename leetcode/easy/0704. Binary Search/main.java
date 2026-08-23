// Solved by @kitanoyoru
// https://leetcode.com/problems/binary-search/

class Solution {
   public static int search(int[] nums, int target) {
      int start = 0, end = nums.length - 1;

      while (start <= end) {
         int mid = (int) Math.floor((start + end) / 2);

         if (nums[mid] == target) {
            return mid;
         } else if (nums[mid] < target) {
            start += 1;
         } else {
            end -= 1;
         }
      }

      return -1;
   }
}
