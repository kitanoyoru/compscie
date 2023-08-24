impl Solution {
    pub fn num_identical_pairs(nums: Vec<i32>) -> i32 {
        let mut s = 0;

        for i in 0..nums.len() {
            for j in i + 1..nums.len() {
                if nums[i] == nums[j] {
                    s += 1;
                }
            }
        }

        s
    }
}
