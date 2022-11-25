# Solved by @kitanoyoru
# https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/


class Solution:
    def findRotation(self, mat: List[List[int]], target: List[List[int]]) -> bool:
        n = len(mat)
        check = [True] * 4

        for i in range(n):
            for j in range(n):
                if mat[i][j] != target[i][j]:
                    check[0] = False
                if mat[i][j] != target[n - j - 1][i]:
                    check[1] = False
                if mat[i][j] != target[n - i - 1][n - j - 1]:
                    check[2] = False
                if mat[i][j] != target[j][n - i - 1]:
                    check[3] = False

        return any(check)
