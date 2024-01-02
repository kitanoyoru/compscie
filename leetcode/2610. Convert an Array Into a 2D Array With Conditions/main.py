from typing import List


class Solution:
    def findMatrix(self, nums: List[int]) -> List[List[int]]:
        res: List[List[int]] = []
        freq = [0] * (len(nums) + 1)

        for num in nums:
            if freq[num] >= len(res):
                res.append([])

            res[freq[num]].append(num)
            freq[num] += 1

        return res
