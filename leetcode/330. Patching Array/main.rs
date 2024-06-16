impl Solution {
    pub fn min_patches(nums: Vec<i32>, n: i32) -> i32 {
        let (mut missing, mut result, mut idx) = (1, 0, 0);

        while missing <= n as i64 {
            if idx < nums.len() && nums[idx] as i64 <= missing {
                missing += nums[idx] as i64;
                idx += 1;
            } else {
                missing += missing;
                result += 1;
            }
        }

        result
    }
}
