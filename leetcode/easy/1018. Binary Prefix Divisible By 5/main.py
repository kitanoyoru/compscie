class Solution:
    def prefixesDivBy5(self, nums: list[int]) -> list[bool]:
        result, num = [], 0

        for i, bit in enumerate(nums):
            num = (2 * num + bit) % 5
            result.append(num == 0)

        return result
