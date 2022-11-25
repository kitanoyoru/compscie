# Solved by @kitanoyoru
# https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

from typing import List


class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        [buy, sell] = [float("inf"), 0]

        for price in prices:
            buy = min(buy, price)
            sell = max(sell, price - buy)

        return sell
