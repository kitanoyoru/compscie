class Solution:
    def arrayStringsAreEqual(self, word1: List[str], word2: List[str]) -> bool:
        for ch1, ch2 in zip(self.__generate_ch(word1), self.__generate_ch(word2)):
            if ch1 != ch2:
                return False
        return True

    def __generate_ch(self, words: List[str]):
        for word in words:
            for ch in word:
                yield ch
        yield None
