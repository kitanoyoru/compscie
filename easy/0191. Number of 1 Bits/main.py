class Solution:
    def hammingWeight(self, n: int) -> int:
        return [int(num) for num in str(bin(n)).replace("0b", "")].count(1)
