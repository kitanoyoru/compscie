// Solved by @kitanoyoru
// https://leetcode.com/problems/shuffle-the-array/

impl Solution {
    pub fn shuffle(nums: Vec<i32>, n: i32) -> Vec<i32> {
        let n = n as usize;
        let mut ans = vec![0; nums.len()];

        for i in 0..n {
            ans[2 * i] = nums[i];
            ans[2 * i + 1] = nums[i + n];
        }

        ans
    }
}
