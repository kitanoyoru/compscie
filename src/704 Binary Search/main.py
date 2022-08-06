# Solved by @kitanoyoru
# https://leetcode.com/problems/binary-search/

from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        [start, end] = [0, len(nums) - 1]

        while start <= end:
            mid = start + ((end - start) >> 1)
            if nums[mid] == target:
                return mid
            elif nums[mid] > target:
                end = mid - 1
            else:
                start = mid + 1

        return -1
