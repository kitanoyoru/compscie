impl Solution {
    pub fn is_monotonic(nums: Vec<i32>) -> bool {
        let (mut inc, mut dec) = (false, false);

        for i in 1..nums.len() {
            if nums[i] > nums[i - 1] {
                if dec {
                    return false;
                }
                inc = true
            } else if nums[i] < nums[i - 1] {
                if inc {
                    return false;
                }
                dec = true
            }
        }

        !(inc && dec)
    }
}
