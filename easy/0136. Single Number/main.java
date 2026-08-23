// Solved by @kitanoyoru
// https://leetcode.com/problems/single-number/submissions/

class Solution {
    public int singleNumber(int[] nums) {
       int ans = 0;
       for (int num : nums) {
         ans ^= num;
       }

       return ans;
    }
}
