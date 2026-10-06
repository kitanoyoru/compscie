class Solution:
    def detectCapitalUse(self, word: str) -> bool:
        return (
            (word == word.lower())
            or (word == word.capitalize())
            or (word == word.upper())
        )
