// Solved by @kitanoyoru
// https://leetcode.com/problems/monotonic-array/


const isMonotonic = (nums: number[]): boolean => {
  let incCount = 0, decrCount = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i-1]) {
      incCount++;
    } else if (nums[i] < nums[i-1]) {
      decrCount++;
    }
  }

  return !(incCount && decrCount);
}

console.log(isMonotonic([1, 1, 0]));