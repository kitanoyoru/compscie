from typing import List


class Solution:
    def minDeletions(self, s: str) -> int:
        freq = self.find_sorted_freq(s)

        d = 0
        for i in range(24, -1, -1):
            if freq[i] == 0:
                break

            if freq[i] >= freq[i + 1]:
                prev = freq[i]
                freq[i] = max(0, freq[i + 1] - 1)
                d += prev - freq[i]

        return d

    def find_sorted_freq(self, s: str) -> List[int]:
        arr = [0] * 26

        for c in s:
            arr[ord(c) - ord("a")] += 1

        return sorted(arr)
