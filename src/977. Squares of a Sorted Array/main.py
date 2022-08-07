# Solved by @kitanoyoru
# https://leetcode.com/problems/squares-of-a-sorted-array/

from typing import List

# first
def sortedSquares(nums: List[int]) -> List[int]:
    return sorted(map(lambda x: x ** 2, nums))

# second
class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        sortedSquaresNums = []

        [lp, rp] = [0, len(nums) - 1]

        for _ in range(rp, -1, -1):
            if abs(nums[lp]) < nums[rp]:
                sortedSquaresNums.insert(0, nums[rp] ** 2)
                rp -= 1
                continue
            sortedSquaresNums.insert(0, nums[lp] ** 2)
            lp += 1

        return sortedSquaresNums
