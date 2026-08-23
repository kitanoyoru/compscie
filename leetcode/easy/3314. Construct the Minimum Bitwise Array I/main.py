from typing import List


class Solution:
    def minBitwiseArray(self, nums: List[int]) -> List[int]:
        return list(map(lambda value: next((i for i in range(value) if (i | (i + 1)) == value), -1), nums))
