# Solved by @kitanoyoru
# https://leetcode.com/problems/monotonic-array/


class Solution:
    def isMonotonic(self, nums: List[int]) -> bool:
        inc, dec = True, True
        for i in range(1, len(nums)):
            inc &= nums[i] <= nums[i - 1]
            dec &= nums[i] >= nums[i - 1]
        return inc or dec
