impl Solution {
    pub fn is_ugly(mut n: i32) -> bool {
        if n <= 0 {
            return false;
        }

        for p in [2, 3, 5] {
            while n % p == 0 {
                n /= p;
            }
        }

        n == 1
    }
}
