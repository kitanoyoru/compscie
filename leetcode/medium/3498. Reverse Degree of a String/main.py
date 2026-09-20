class Solution:
    def reverseDegree(self, s: str) -> int:
        result = 0

        for i, v in enumerate(s):
            result += (i + 1) * (26 - (ord(v) - 97))

        return result
