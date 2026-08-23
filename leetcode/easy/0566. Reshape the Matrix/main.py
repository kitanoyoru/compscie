# Solved by @kitanoyoru
# https://leetcode.com/problems/reshape-the-matrix/

from typing import List


class Solution:
    def matrixReshape(self, mat: List[List[int]], r: int, c: int) -> List[List[int]]:
        if (len(mat) * len(mat[0])) / c != r:
            return mat

        ans: List[List[int]] = []

        [row, col] = [0, 0]

        for i in range(r):
            ans.append([])
            for _ in range(c):
                ans[i].append(mat[row][col])
                if col == len(mat[row]) - 1:
                    row += 1
                    col = 0
                else:
                    col += 1

        return ans
