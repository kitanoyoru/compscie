from typing import Tuple


class Solution:
    def dominantIndex(self, nums: list[int]) -> int:
        largest, idx = self.findLargest(nums)

        for i, num in enumerate(nums):
            if largest < 2 * num and i != idx:
                return -1

        return idx

    def findLargest(self, nums: list[int]) -> Tuple[int, int]:
        largest, idx = float('-inf'), 0

        for i, num in enumerate(nums):
            if num > largest:
                largest = num
                idx = i

        return (largest, idx)
