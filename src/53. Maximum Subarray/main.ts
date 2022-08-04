// Solved by @kitanoyoru
// https://leetcode.com/problems/maximum-subarray/

const maxSubArray = (nums: number[]): number => {
  let maxSum = nums[0]
  for (let i = 1; i < nums.length; i++) {
    nums[i] = Math.max(nums[i], nums[i] + nums[i - 1])
    if (maxSum < nums[i]) maxSum = nums[i]
  }

  return maxSum
}

console.log(maxSubArray([1]))

// dac solution, but idk why [-2, -1] testcase doesn't completed
/*
const f = (nums: number[], start: number, end: number): number => {
  if (start == end) {
    return nums[end];
  }
  let sum = 0;
  let lmax = Number.MIN_VALUE, rmax = Number.MIN_VALUE;

  const mid = start + ((end - start) >> 1);
  const left = f(nums, start, mid);
  const right = f(nums, mid + 1, end);

  for (let i = mid; i >= start; i--) {
    sum += nums[i];
    if (sum > lmax) {
      lmax = sum;
    }
  }

  sum = 0;

  for (let i = mid + 1; i <= end; i++) {
    sum += nums[i];
    if (sum > rmax) {
      rmax = sum;
    }
  }

  return Math.max(left, right, lmax + rmax);
};

const maxSubArray = (nums: number[]): number => {
  return f(nums, 0, nums.length - 1);
}
*/
