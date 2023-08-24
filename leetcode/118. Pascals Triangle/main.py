# Solved by @kitanoyoru
# https://leetcode.com/problems/pascals-triangle/

from typing import List


class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        pascalTriangle: List[List[int]] = []
        for i in range(numRows):
            row: List[int] = []

            row.append(1)
            for j in range(1, i):
                val = pascalTriangle[i - 1][j - 1] + pascalTriangle[i - 1][j]
                row.append(val)
            if i != 0:
                row.append(1)

            pascalTriangle.append(row)

        return pascalTriangle
