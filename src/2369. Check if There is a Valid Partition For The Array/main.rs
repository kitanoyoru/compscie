impl Solution {
    pub fn valid_partition(nums: Vec<i32>) -> bool {
        let n = nums.len();

        if n == 1 {
            return false;
        }

        let mut dp = [true, false, if n > 1 { nums[0] == nums[1] } else { false }];

        for i in 2..n {
            let mut curr = false;

            if nums[i] == nums[i - 1] && dp[1] {
                curr = true;
            }

            if nums[i] == nums[i - 1] && nums[i - 1] == nums[i - 2] && dp[0] {
                curr = true;
            }

            if nums[i] - nums[i - 1] == 1 && nums[i - 1] - nums[i - 2] == 1 && dp[0] {
                curr = true;
            }

            dp[0] = dp[1];
            dp[1] = dp[2];
            dp[2] = curr;
        }

        dp[2]
    }
}
