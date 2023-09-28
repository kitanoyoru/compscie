impl Solution {
    pub fn decode_at_index(s: String, k: i32) -> String {
        let mut k = k as i64;

        let mut tape_length: i64 = 0;
        let mut idx = 0;

        while tape_length < k {
            if let Some(v) = s.chars().nth(idx) {
                if v.is_digit(10) {
                    tape_length *= v.to_digit(10).unwrap() as i64;
                } else {
                    tape_length += 1;
                }
            }

            idx += 1;
        }

        for j in (0..idx).rev() {
            if let Some(v) = s.chars().nth(j) {
                if v.is_digit(10) {
                    tape_length /= v.to_digit(10).unwrap() as i64;
                    k = k % tape_length
                } else {
                    if k == 0 || k == tape_length {
                        return v.to_string();
                    }

                    tape_length -= 1;
                }
            }
        }

        return "".to_string();
    }
}
