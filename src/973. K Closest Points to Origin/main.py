# Solved by @kitanoyoru
# https://leetcode.com/problems/k-closest-points-to-origin/

from math import sqrt, pow
from typing import List

class Solution:
    def distance(self, v: List[int]) -> float:
        return sqrt(pow(v[0], 2) + pow(v[1], 2))

    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        return sorted(points, key=self.distance)[:k]
