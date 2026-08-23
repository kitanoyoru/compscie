class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])

        for row in range(rows):
            for col in range(cols):
                if row == 0 and col == 0:
                    continue
                elif row == 0 and col != 0:
                    grid[row][col] += grid[row][col - 1]
                elif row != 0 and col == 0:
                    grid[row][col] += grid[row - 1][col]
                else:
                    grid[row][col] = min(grid[row - 1][col], grid[row][col - 1])

        return grid[rows - 1][cols - 1]
