# Solved by @kitanoyoru
# https://leetcode.com/problems/next-greater-element-ii/


class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        n = len(nums)
        if n == 0:
            return []

        stack = []
        ans = [-1] * n

        for _ in range(2):
            for i in range(n - 1, -1, -1):
                while len(stack) > 0 and stack[-1] <= nums[i]:
                    stack.pop()
                if len(stack) > 0:
                    ans[i] = stack[-1]

                stack.append(nums[i])

        return ans
