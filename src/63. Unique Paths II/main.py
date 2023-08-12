class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        n, m = len(obstacleGrid), len(obstacleGrid[0])
        
        prev, curr = [0] * m, [0] * m 

        prev[0] = 1

        for i in range(n):
            curr[0] = 0 if obstacleGrid[i][0] else prev[0]
            for j in range(1, m):
                if obstacleGrid[i][j] == 1:
                    curr[j] = 0
                else:
                    curr[j] = curr[j-1] + prev[j] 

            prev, curr = curr, prev

        return prev[m-1]

