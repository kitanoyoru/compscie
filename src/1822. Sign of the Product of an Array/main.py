from functools import reduce


class Solution:
    def arraySign(self, nums: List[int]) -> int:
        def closure(acc: int, num: int) -> int:
            if num == 0:
                return 0

            return acc if num > 0 else -acc

        return reduce(closure, nums, 1)
