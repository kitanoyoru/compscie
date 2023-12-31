impl Solution {
    pub fn max_length_between_equal_characters(s: String) -> i32 {
        let mut max_length: i32 = -1;

        for left in 0..s.len() {
            for right in (left + 1)..s.len() {
                if s.chars().nth(left) == s.chars().nth(right) {
                    max_length = max_length.max((right - left - 1) as i32);
                }
            }
        }

        max_length
    }
}
