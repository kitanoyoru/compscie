# Solved by @kitanoyoru
# https://leetcode.com/problems/first-bad-version/

# The isBadVersion API is already defined for you.
# def isBadVersion(version: int) -> bool:

class Solution:
    def firstBadVersion(self, n: int) -> int:
        [start, end, ans] = [0, n, 0]
        
        while start <= end:
            mid = start + ((end - start) >> 1)
            if isBadVersion(mid):
                ans = mid
                end = mid - 1
            else:
                start = mid + 1

        return ans

