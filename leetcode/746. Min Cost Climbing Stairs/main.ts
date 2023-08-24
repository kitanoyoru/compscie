// Solved by @kitanyooru
// https://leetcode.com/problems/min-cost-climbing-stairs/

const minCostClimbingStairs = (cost: number[]): number => {
  const n = cost.length
  let a = cost[0],
    b = cost[1],
    c = 0

  if (n < 2) return Math.min(a, b)
  for (let i = 2; i < n; i++) {
    c = cost[i] + Math.min(a, b)
    a = b
    b = c
  }

  return Math.min(a, b)
}
