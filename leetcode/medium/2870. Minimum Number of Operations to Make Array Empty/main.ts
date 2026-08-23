const minOperations = (nums: number[]): number => {
  const freq = findFreq(nums)

  let result = 0
  for (const val of freq.values()) {
    if (val < 2) return -1
    result += Math.floor(val / 3)
    if (val % 3) result++
  }

  return result
}

const findFreq = (nums: number[]): Map<number, number> => {
  let m = new Map<number, number>()

  for (const num of nums) {
    if (!m.has(num)) {
      m.set(num, 0)
    }

    m.set(num, m.get(num)! + 1)
  }

  return m
}
