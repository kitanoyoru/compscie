// Solved by @kitanoyoru
// https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

const maxProfit = (prices: number[]): number => {
  let buy = Number.MAX_VALUE,
    sell = 0

  for (const price of prices) {
    buy = Math.min(buy, price)
    sell = Math.max(sell, price - buy)
  }

  return sell
}
