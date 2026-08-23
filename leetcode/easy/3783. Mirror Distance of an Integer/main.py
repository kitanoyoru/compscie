class Solution:
    def mirrorDistance(self, n: int) -> int:
        return abs(n - self.reverse(n))

    def reverse(self, value: int) -> int:
        result = 0
        while value != 0:
            digit = value % 10
            result = 10 * result + digit
            value //= 10

        return result
