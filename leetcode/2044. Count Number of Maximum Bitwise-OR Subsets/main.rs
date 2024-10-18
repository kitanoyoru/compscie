impl Solution {
    pub fn count_max_or_subsets(nums: Vec<i32>) -> i32 {
        let mut result = 0;
        let mut max_or = 0;

        for &num in &nums {
            max_or = max_or | num;
        }

        Self::backtrack(&nums, 0, 0, max_or, &mut result);

        result
    }

    fn backtrack(nums: &[i32], idx: usize, curr_or: i32, max_or: i32, result: &mut i32) {
        if curr_or == max_or {
            *result += 1;
        }

        for i in idx..nums.len() {
            Self::backtrack(nums, i + 1, curr_or | nums[i], max_or, result);
        }
    }
}
