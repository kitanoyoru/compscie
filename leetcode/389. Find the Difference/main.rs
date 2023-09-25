impl Solution {
    fn find_the_difference(s: String, t: String) -> char {
        let mut result = 0;
        for c in s.bytes().chain(t.bytes()) {
            result ^= c;
        }

        result as char
    }
}
