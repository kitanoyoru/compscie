#include <vector>
#include <algorithm>

class Solution {
public:
    int maximumProduct(std::vector<int>& nums) {
      std::sort(nums.begin(), nums.end());

      int n = nums.size();

      int first = nums[0] * nums[1] * nums[2];
      int second = nums[n-1] * nums[n-2] * nums[n-3];

      return std::max(first, second);
    }
};
