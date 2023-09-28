from typing import List


class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        return list(filter(lambda v: v & 1 == 0, nums)) + list(filter(lambda v: v & 1 == 1, nums))
        
