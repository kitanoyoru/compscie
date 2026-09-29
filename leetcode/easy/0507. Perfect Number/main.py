import math


class Solution:
    def checkPerfectNumber(self, num: int) -> bool:
        if num <= 1:
            return False

        n = math.isqrt(num)

        s = 0
        for i in range(1, n + 1):
            if num % i == 0:
                s += i
                pair = num // i
                if i != pair and pair != num:
                    s += pair

        return s == num
