# Solved by @kitanoyoru
# https://leetcode.com/problems/search-insert-position/

from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        [start, end, ans] = [0, len(nums) - 1, 0]

        while start <= end:
            mid = start + ((end - start) >> 1)
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                start = mid + 1
                ans = mid + 1
            else:
                end = mid - 1
                ans = mid
        
        return ans
