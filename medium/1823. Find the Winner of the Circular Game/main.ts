// Solved by @kitanoyoru
// https://leetcode.com/problems/find-the-winner-of-the-circular-game/

const findTheWinner = (n: number, k: number): number => {
  const q: number[] = []
  for (let i = 1; i <= n; i++) {
    q.push(i)
  }

  while (q.length > 1) {
    for (let i = 1; i < k; i++) {
      const temp = q[0]
      q.shift()
      q.push(temp)
    }
    q.shift()
  }

  return q[0]
}
