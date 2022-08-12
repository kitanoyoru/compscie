// Solved by @kitanoyoru
// https://leetcode.com/problems/final-value-of-variable-after-performing-operations/

impl Solution {
    pub fn final_value_after_operations(operations: Vec<String>) -> i32 {
        let mut ans = 0;
        for op in operations {
            if op.starts_with("+") || op.ends_with("+") {
                ans += 1;
            } else {
                ans -= 1;
            }
        }

        ans
    }
}

