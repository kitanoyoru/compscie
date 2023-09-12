from collections import deque, namedtuple

from typing import Deque, List


Cell = namedtuple("Cell", ["x", "y"])


class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        q: Deque[Cell] = deque()

        n, m = len(mat), len(mat[0])

        dist = [[0, 1], [1, 0], [0, -1], [-1, 0]]

        for i in range(n):
            for j in range(m):
                if mat[i][j]:
                    mat[i][j] = 10e5
                else:
                    q.append(Cell(i, j))

        while len(q) > 0:
            cell = q.popleft()

            for d in dist:
                newX, newY = cell.x + d[0], cell.y + d[1]

                if newX >= 0 and newX < n and newY >= 0 and newY < m:
                    if mat[newX][newY] > mat[cell.x][cell.y] + 1:
                        mat[newX][newY] = mat[cell.x][cell.y] + 1
                        q.append(Cell(newX, newY))

        return mat
