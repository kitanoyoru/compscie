impl Solution {
    pub fn min_changes(s: String) -> i32 {
        let mut result = 0;

        for i in (0..s.len()).step_by(2) {
            if i + 1 < s.len() {
                let substr = &s[i..i + 2];

                if substr == "01" || substr == "10" {
                    result += 1;
                }
            }
        }

        result
    }
}

