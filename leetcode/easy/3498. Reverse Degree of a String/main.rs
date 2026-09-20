impl Solution {
    pub fn reverse_degree(s: String) -> i32 {
        s.bytes()
            .enumerate()
            .map(|(i, v)| (i as i32 + 1) * (26 - (v - 97) as i32))
            .sum()
    }
}
