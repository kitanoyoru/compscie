impl Solution {
    pub fn min_bitwise_array(nums: Vec<i32>) -> Vec<i32> {
        let mut result = vec![-1; nums.len()];

        for (idx, num) in nums.iter().enumerate() {
            let num = *num;

            if num != 2 {
                result[idx] = num - (((num + 1) & (-(num) - 1)) / 2);
            }
        }

        result
    }
}

