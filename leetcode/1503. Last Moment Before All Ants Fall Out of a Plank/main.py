from typing import List


class Solution:
    def getLastMoment(self, n: int, left: List[int], right: List[int]) -> int:
        result = 0

        for v in left:
            result = max(result, v)
        for v in right:
            result = max(result, n - v)

        return result
