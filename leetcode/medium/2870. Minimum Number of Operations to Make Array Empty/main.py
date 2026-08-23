import math

from typing import List, Dict


class Solution:
    def minOperations(self, nums: List[int]) -> int:
        freq = self._find_freq(nums)

        result = 0
        for val in freq.values():
            if val < 2:
                return -1

            result += math.floor(val / 3)
            if val % 3 != 0:
                result += 1

        return result

    def _find_freq(self, nums: List[int]) -> Dict[int, int]:
        d: Dict[int, int] = dict()

        for val in nums:
            if val not in d:
                d[val] = 0

            d[val] += 1

        return d
