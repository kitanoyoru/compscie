from typing import List


class Solution:
    def sortByBits(self, arr: List[int]) -> List[int]:
        return sorted(arr, key=lambda x: (self.countSetBits(x), x))

    def countSetBits(self, number: int) -> int:
        result = 0

        while number != 0:
            result += number & 1
            number >>= 1

        return result
