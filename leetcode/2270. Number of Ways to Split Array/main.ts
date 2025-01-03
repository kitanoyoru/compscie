const waysToSplitArray = (nums: number[]): number => {
  let result = 0, prefixSum = 0

  let arraySum = nums.reduce((sum, num) => sum + num, 0);

  for (let i = 0; i < nums.length - 1; i++) {
    prefixSum += nums[i];
    if (prefixSum >= arraySum - prefixSum) {
      result++;
    }
  }

  return result
};

