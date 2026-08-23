from typing import List


class Solution:
    def minBitwiseArray(self, nums: List[int]) -> List[int]:
        result = []

        for num in nums:
            if num != 2:
                result.append(num - ((num + 1) & (-num - 1)) // 2)
            else:
                result.append(-1)

        return result
