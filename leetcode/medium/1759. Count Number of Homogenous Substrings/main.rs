impl Solution {
    pub fn count_homogenous(s: String) -> i32 {
        if s.is_empty() {
            return 0;
        }

        let chars: Vec<char> = s.chars().collect();

        let mut result: i64 = 0;
        let mut appears = 1;

        for i in 1..chars.len() {
            if chars[i] == chars[i - 1] {
                appears += 1;
            } else {
                result += (appears * (appears + 1)) / 2;
                appears = 1
            }
        }

        result += (appears * (appears + 1)) / 2;

        (result % (10i64.pow(9) + 7)) as i32
    }
}
