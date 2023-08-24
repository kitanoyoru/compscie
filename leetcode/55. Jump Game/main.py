# Solved by @kitanoyoru
# https://leetcode.com/problems/jump-game/?envType=study-plan&id=dynamic-programming-i

from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        max_jump = 0, i = 0
        while (i <= max_jump):
            max_jump = max(i + nums[i], max_jump)
            if max_jump >= len(nums) - 1:
                return True
            i += 1

        return False
