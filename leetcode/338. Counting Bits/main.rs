// first solution
impl Solution {
    pub fn count_bits(n: i32) -> Vec<i32> {
        (0..=n).map(|x| x.count_ones() as i32).collect()
    }
}

// second solution
impl Solution {
    pub fn count_bits(n: i32) -> Vec<i32> {
        let n = (n + 1) as usize;
        let mut ones = vec![0; n];
        for i in 1..n {
            match i % 2 {
                0 => ones[i] = ones[i / 2],
                1 => ones[i] = ones[i - 1] + 1,
                _ => unreachable!(),
            }
        }

        ones
    }
}
