from typing import List

class Solution:
    def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:
        max_candy = max(candies)

        res: List[bool] = []

        for candy in candies:
            if candy + extraCandies >= max_candy:
                res.append(True)
            else:
                res.append(False)

        return res
