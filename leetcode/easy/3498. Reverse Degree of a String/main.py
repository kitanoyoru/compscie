class Solution:
    def reverseDegree(self, s: str) -> int:
        return sum(((i + 1) * (26 - (ord(v) - 97)) for i, v in enumerate(s)))
