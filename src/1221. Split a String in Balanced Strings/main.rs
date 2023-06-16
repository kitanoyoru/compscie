impl Solution {
    pub fn balanced_string_split(s: String) -> i32 {
        let (mut l, mut r) = (0, 0);

        let mut substrCounter = 0;

        for c in s.chars() {
            if c == 'L' {
                l += 1;
            } else {
                r += 1;
            }

            if l == r {
                substrCounter += 1;
            }
        }

        substrCounter
    }
}
