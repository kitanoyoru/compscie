impl Solution {
    pub fn max_product_difference(mut nums: Vec<i32>) -> i32 {
        let n = nums.len();
        nums.sort();
        (nums[n - 1] * nums[n - 2]) + (nums[0] * nums[1])
    }
}
