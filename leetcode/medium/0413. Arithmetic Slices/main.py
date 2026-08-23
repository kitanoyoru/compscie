# Solved by @kitanoyoru
# https://leetcode.com/problems/arithmetic-slices/


class Solution:
    def numberOfArithmeticSlices(self, nums: List[int]) -> int:
        if not len(nums):
            return 0

        diff, ans = 0, 0

        for i in range(0, len(nums) - 2):
            diff = nums[i + 1] - nums[i]
            for j in range(i + 2, len(nums)):
                if nums[j] - nums[j - 1] == diff:
                    ans += 1
                else:
                    break

        return ans
