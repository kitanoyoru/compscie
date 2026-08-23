impl Solution {
    pub fn min_bitwise_array(nums: Vec<i32>) -> Vec<i32> {
        let mut result = vec![-1; nums.len()];

        for (idx, value) in nums.iter().enumerate() {
            for i in 0..*value {
                if (i | (i + 1)) == *value {
                    result[idx] = i;
                    break;
                }
            }
        }

        result
    }
}

