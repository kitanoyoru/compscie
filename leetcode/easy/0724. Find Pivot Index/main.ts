function pivotIndex(nums: number[]): number {
  let total = 0
  for (const v of nums) {
    total += v
  }

  let prefix = 0
  for (let i = 0; i < nums.length; i++) {
    if (prefix == total - prefix - nums[i]) {
      return i
    }

    prefix += nums[i]
  }

  return -1
}
