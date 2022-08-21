// Solved by @kitanoyoru
// https://leetcode.com/problems/sort-colors/

/**
 Do not return anything, modify nums in-place instead.
 */
const sortColors = (nums: number[]): void => {
  let zero = 0, one = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == 0) zero++;
    if (nums[i] == 1) one++;
  }
  for (let i = 0; i < nums.length; i++) {
    if (i < zero) nums[i] = 0;
    if (i >= zero && i < zero + one) nums[i] = 1;
    if (i >= zero + one && i < nums.length) nums[i] = 2;
  }
};
