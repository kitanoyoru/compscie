from typing import List
from heapq import heappush, heappop


class Solution:
    def __init__(self) -> None:
        self.directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        rows, cols = len(heights), len(heights[0])

        dist = [[float("inf") for _ in range(cols)] for _ in range(rows)]
        dist[0][0] = 0

        q = [(0, 0, 0)]

        while len(q) > 0:
            effort, x, y = heappop(q)

            if x == rows - 1 and y == cols - 1:
                return effort

            for dx, dy in self.directions:
                nx, ny = x + dx, y + dy

                if 0 <= nx < rows and 0 <= ny < cols:
                    neffort = max(effort, abs(heights[x][y] - heights[nx][ny]))
                    if neffort < dist[nx][ny]:
                        dist[nx][ny] = neffort
                        heappush(q, (neffort, nx, ny))

        return 0
