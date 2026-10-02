class Solution:
    def reverseOnlyLetters(self, s: str) -> str:
        chars = list(s)

        left, right = 0, len(s) - 1

        def isLetter(x: str):
            return x.islower() or x.isupper()

        while left <= right:
            if not isLetter(chars[left]):
                left += 1
            elif not isLetter(chars[right]):
                right -= 1
            else:
                chars[left], chars[right] = chars[right], chars[left]
                left += 1
                right -= 1

        return "".join(chars)
