from typing import List
from array import array

class Solution:
    def mincostTickets(self, days: List[int], costs: List[int]) -> int:
        dp = array('H', [0] * 366)

        days = set(days)

        for day in range(1, 366):
            if day in days:
                first_ticket = max(dp[day-1] + costs[0], 0)
                second_ticket = max(dp[day-7] + costs[1], 0)
                third_ticket = max(dp[day-30] + costs[2], 0)

                dp[day] = min(first_ticket, second_ticket, third_ticket)
            else:
                dp[day] = dp[day-1]
        
        return dp[365]
