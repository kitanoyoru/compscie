# Solved by @kitanoyoru

from collections import defaultdict
from typing import DefaultDict, List


class Solution:
    def __init__(self) -> None:
        self.hm: DefaultDict[int, int] = defaultdict(int)

    def smallerNumbersThanCurrent(self, nums: List[int]) -> List[int]:
        for i in range(len(nums)):
            for j in range(len(nums)):
                if i != j and nums[i] > nums[j]:
                    self.hm[i] += 1

        ans: List[int] = [0 for _ in range(len(nums))]
        for k, v in self.hm.items():
            ans[k] = v

        return ans
