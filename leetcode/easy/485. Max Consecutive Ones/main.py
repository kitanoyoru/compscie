class Solution:
    def findMaxConsecutiveOnes(self, nums: list[int]) -> int:
        counter, result = 0, 0

        for num in nums:
            if num == 1:
                counter += 1
            else:
                result = max(result, counter)
                counter = 0

        if counter != 0:
            result = max(result, counter)

        return result
