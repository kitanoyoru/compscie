// Solved by @kitanoyoru
// https://leetcode.com/problems/partition-labels/

const partitionLabels = (s: string) => {
  const last = new Map<string, number>()
  for (let i = 0; i < s.length; i++) {
    last.set(s[i], i)
  }

  let res: number[] = []
  let max = 0
  let prev = -1

  for (let i = 0; i < s.length; i++) {
    max = Math.max(max, last.get(s[i])!)
    if (max == i) {
      res.push(max - prev)
      prev = max
    }
  }

  return res
}
