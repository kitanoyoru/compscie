function dominantIndex(nums: number[]): number {
  const [largest, idx] = findLargest(nums)

  for (let i = 0; i < nums.length; i++) {
    if (largest < 2 * nums[i] && i != idx) {
      return -1
    }
  }

  return idx
}

function findLargest(nums: number[]): [number, number] {
  let [largest, idx] = [Number.MIN_SAFE_INTEGER, 0]

  nums.forEach((num, i) => {
    if (num > largest) {
      ;[largest, idx] = [num, i]
    }
  })

  return [largest, idx]
}
