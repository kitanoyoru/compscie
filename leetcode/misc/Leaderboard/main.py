# Solved by @kitanoyoru
# https://binarysearch.com/problems/Leaderboard


class Solution:
    def solve(self, nums):
        indexDict = {n: i for (i, n) in enumerate(sorted(set(nums), reverse=True))}
        return [indexDict[n] for n in nums]
