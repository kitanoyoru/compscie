impl Solution {
    pub fn min_flips(a: i32, b: i32, c: i32) -> i32 {
        ((a | b) & !c).count_ones() + ((a & b) & !c).count_ones() + (!(a | b) & c).count_ones()
    }
}
