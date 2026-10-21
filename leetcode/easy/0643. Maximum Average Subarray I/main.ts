function findMaxAverage(nums: number[], k: number): number {
  let windowSum = nums.slice(0, k).reduce((prev, curr) => prev + curr)
  let maxSum = windowSum

  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]
    maxSum = Math.max(maxSum, windowSum)
  }

  return maxSum / k
}
