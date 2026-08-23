impl Solution {
    pub fn best_closing_time(customers: String) -> i32 {
        let (mut max_penalty, mut penalty) = (0, 0);

        let mut max_penalty_idx: i32 = -1;

        for (i, c) in customers.chars().enumerate() {
            if c == 'Y' {
                penalty += 1;
            } else {
                penalty -= 1;
            }

            if penalty > max_penalty {
                max_penalty = penalty;
                max_penalty_idx = i as i32;
            }
        }

        max_penalty_idx + 1
    }
}
