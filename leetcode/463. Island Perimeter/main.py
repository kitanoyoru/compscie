class Solution:
    def islandPerimeter(self, grid: List[List[int]]) -> int:
        lands, neigh = 0, 0

        for i in range(len(grid)):
            for j in range(len(grid[i])):
                if grid[i][j] == 1:
                    lands += 1
                    if i < len(grid) - 1 and grid[i + 1][j] == 1:
                        neigh += 1
                    if j < len(grid[i]) - 1 and grid[i][j + 1] == 1:
                        neigh += 1

        return 4 * lands - 2 * neigh
