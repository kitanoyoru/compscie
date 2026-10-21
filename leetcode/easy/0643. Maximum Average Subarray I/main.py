class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        window = best = sum(nums[:k])

        for entering, leaving in zip(nums[k:], nums):
            window += entering - leaving
            best = max(best, window)

        return best / k
