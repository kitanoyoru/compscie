class Solution:
    def isOneBitCharacter(self, bits: list[int]) -> bool:
        n, idx = len(bits), 0

        while idx < n - 1:
            idx += bits[idx] + 1

        return idx == n - 1
