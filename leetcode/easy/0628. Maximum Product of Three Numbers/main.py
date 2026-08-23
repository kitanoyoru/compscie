class Solution:
    def maximumProduct(self, nums: List[int]) -> int:
        nums = sorted(nums)

        first = nums[0] * nums[1] * nums[-1]
        second = nums[-1] * nums[-2] * nums[-3]

        return max(first, second)
