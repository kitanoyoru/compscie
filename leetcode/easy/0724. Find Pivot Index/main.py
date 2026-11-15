class Solution:
    def pivotIndex(self, nums: list[int]) -> int:
        total = 0
        for v in nums:
            total += v

        prefix = 0
        for i, v in enumerate(nums):
            if prefix == total - prefix - v:
                return i

            prefix += v

        return -1
