class Solution:
    def maxLengthBetweenEqualCharacters(self, s: str) -> int:
        max_length = -1

        for left in range(len(s)):
            for right in range(left + 1, len(s)):
                if s[left] == s[right]:
                    max_length = max(max_length, right - left - 1)

        return max_length
