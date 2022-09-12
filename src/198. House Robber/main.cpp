// Solved by @kitanoyoru
// https://leetcode.com/problems/house-robber/

class Solution {
public:
  int rob(vector<int>& nums) {
    const int n = nums.size();
    if (n == 0) return 0;

    int prev1 = 0, prev2 = 0;
    
    // prev2, prev1, num
    for (const int num : nums) {
      const int temp = prev1;
      prev1 = (prev2 + num > prev1) ? (prev2 + num) : prev1;
      prev2 = temp; 
    }

    return prev1;
  }
};
