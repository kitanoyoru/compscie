from typing import List


class Solution:
    def matrixScore(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])

        res = (1 << cols - 1) * rows

        for c in range(1, cols):
            val, cnt = (1 << (cols - 1 - c)), 0
            for r in range(rows):
                if grid[r][c] != grid[r][0]:
                    cnt += 1

            res += max(cnt, rows - cnt) * val

        return res
