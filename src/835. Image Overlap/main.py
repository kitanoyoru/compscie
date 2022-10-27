# Solved by @kitanoyoru
# https://leetcode.com/problems/image-overlap/

class Solution:
    def largestOverlap(self, img1: List[List[int]], img2: List[List[int]]) -> int:
        rows, cols = len(img1), len(img1[0])
        d = collections.defaultdict(int)
        a, b = [], []

        for i in range(rows):
            for j in range(cols):
                if img1[i][j]:
                    a.append((i, j))
                if img2[i][j]:
                    b.append((i, j))

        res = 0

        for t1 in a:
            for t2 in b:
                t3 = (t2[0] - t1[0], t2[1] - t1[1])
                d[t3] += 1
                res = max(res, d[t3]) 

        return res 
