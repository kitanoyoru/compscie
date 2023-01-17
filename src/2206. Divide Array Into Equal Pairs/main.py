# Solved by @kitanoyoru

import collections

from typing import Dict, List


class Solution:
    def __init__(self) -> None:
        self.hm: Dict[int, int] = collections.defaultdict(int)

    def divideArray(self, nums: List[int]) -> bool:
        for num in nums:
            self.hm[num] += 1

        for v in self.hm.values():
            if v % 2 == 1:
                return False

        return True
