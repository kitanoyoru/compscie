// Solved by @kitanoyoru
// https://leetcode.com/problems/jump-game/

#include <vector>
#include <cmath>

using namespace std;

class Solution {
public:
  bool canJump(vector<int>& nums) {
    int max_jump = 0;
    for (int i = 0; i <= max_jump; i++) {
      max_jump = max(max_jump, i + nums[i]);
      if (max_jump >= nums.size() - 1) {
        return true;
      }
    }

    return false;
  }
};
