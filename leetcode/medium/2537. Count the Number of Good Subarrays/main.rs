use std::collections::HashMap;

impl Solution {
    pub fn count_good(nums: Vec<i32>, k: i32) -> i64 {
        let mut count: HashMap<i32, i32> = HashMap::new();
        let (mut left, mut pair_count, mut result) = (0, 0, 0);

        for right in 0..nums.len() {
            let entry = count.entry(nums[right]).or_insert(0);
            pair_count += *entry;
            *entry += 1;

            while pair_count >= k {
                result += nums.len() - right;

                let entry = count.entry(nums[left]).or_insert(0);
                *entry -= 1;
                pair_count -= *entry;
                left += 1;
            }
        }

        result as i64
    }
}
