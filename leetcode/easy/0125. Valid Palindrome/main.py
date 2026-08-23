from functools import reduce


class Solution:
    def isPalindrome(self, s: str) -> bool:
        parsed_s = reduce(lambda ch, acc: ch + acc if ch.isalnum() else acc, s, "")
        return parsed_s == parsed_s[::-1]
