impl Solution {
    fn bin_expand(x: f64, n: i64) -> f64 {
        match n {
            0 => 1.0,
            n if (n < 0) => 1.0 / Self::bin_expand(x, -n),
            n => match n & 1 == 1 {
                true => x * Self::bin_expand(x * x, (n - 1) / 2),
                false => Self::bin_expand(x * x, n / 2),
            },
        }
    }

    pub fn my_pow(x: f64, n: i32) -> f64 {
        std::thread::Builder::new()
            .stack_size(32 * 1024)
            .spawn(move || Self::bin_expand(x, n as i64))
            .unwrap()
            .join()
            .unwrap()
    }
}
