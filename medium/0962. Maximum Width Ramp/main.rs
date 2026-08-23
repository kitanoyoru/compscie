impl Solution {
    pub fn max_width_ramp(nums: Vec<i32>) -> i32 {
        let n = nums.len();

        let mut result = 0;
        let mut stack = Vec::new();

        for i in 0..n {
            if stack.is_empty() || nums[*stack.last().unwrap()] > nums[i] {
                stack.push(i);
            }
        }

        for j in (0..n).rev() {
            while let Some(&i) = stack.last() {
                if nums[i] <= nums[j] {
                    result = result.max(j - i);
                    stack.pop();
                } else {
                    break;
                }
            }
        }

        result as i32
    }
}

