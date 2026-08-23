impl Solution {
    pub fn maximum_product(mut nums: Vec<i32>) -> i32 {
        nums.sort();

        let n = nums.len();

        let first = nums[0] * nums[1] * nums[n - 1];
        let second = nums[n - 1] * nums[n - 2] * nums[n - 3];

        if first > second {
            first
        } else {
            second
        }
    }
}
