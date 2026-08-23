from typing import List


class Solution:
    def countDays(self, days: int, meetings: List[List[int]]) -> int:
        meetings.sort()

        merged = []

        for meet in meetings:
            if merged and merged[-1][1] >= meet[0]:
                merged[-1][1] = max(merged[-1][1], meet[1])
            else:
                merged.append(meet)

        result = 0
        for meet in merged:
            result += meet[1] - meet[0] + 1

        return days - result
