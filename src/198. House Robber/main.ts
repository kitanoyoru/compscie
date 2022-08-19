// Solved by @kitanoyoru
// https://leetcode.com/problems/house-robber/

const rob = (nums: number[]): number => {
  if (nums.length == 1) {
    return nums[0];
  }

  let ans = new Array(nums.length).fill(0);

  ans[0] = nums[0];
  ans[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    ans[i] = Math.max(ans[i-2] + nums[i], ans[i-1]);
  }

  return ans[nums.length-1];
};

console.log(rob([2, 1]));
