from typing import List, Dict


class Solution:
    def totalNumbers(self, digits: List[int]) -> int:
        seen: Dict[int, bool] = {}
        n = len(digits)

        for i in range(n):
            if digits[i] == 0:
                continue

            for j in range(n):
                if i == j:
                    continue

                for k in range(n):
                    if (k == i) or (k == j) or (digits[k] % 2 != 0):
                        continue

                    seen[digits[i] * 100 + digits[j] * 10 + digits[k]] = True

        return len(seen)
