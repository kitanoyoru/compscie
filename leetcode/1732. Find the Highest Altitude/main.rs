impl Solution {
    pub fn largest_altitude(gains: Vec<i32>) -> i32 {
        let (mut cur_alt, mut max_alt) = (0, 0);

        for gain in &gains {
            cur_alt = cur_alt + gain;
            if cur_alt > max_alt {
                max_alt = cur_alt
            }
        }

        max_alt
    }
}
