impl Solution {
    pub fn ways_to_split_array(nums: Vec<i32>) -> i32 {
        let (mut result, mut prefix_sum) = (0, 0);

        let array_sum: i64 = nums.iter().map(|&x| x as i64).sum();

        for i in 0..nums.len() - 1 {
            prefix_sum += nums[i] as i64;

            if prefix_sum >= array_sum - prefix_sum {
                result += 1;
            }
        }

        result
    }
}

