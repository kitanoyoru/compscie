# Solved by @kitanoyoru
# https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/

from typing import List


class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        [start, end] = [0, len(numbers) - 1]

        while start <= end:
            s = numbers[start] + numbers[end]
            if s == target:
                return [start + 1, end + 1]
            elif s < target:
                start += 1
            else:
                end -= 1

        return []
