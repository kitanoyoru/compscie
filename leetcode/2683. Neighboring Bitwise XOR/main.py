from typing import List


class Solution:
    def doesValidArrayExist(self, derived: List[int]) -> bool:
        original = [0] * (len(derived) + 1)

        original[0] = 0
        for i in range(0, len(derived)):
            original[i+1] = derived[i] ^ original[i]

        check_for_zero = (original[0] == original[len(original) - 1])

        original[0] = 1
        for i in range(0, len(derived)):
            original[i+1] = derived[i] ^ original[i]

        check_for_one = (original[0] == original[len(original) - 1])

        return (check_for_zero or check_for_one)
