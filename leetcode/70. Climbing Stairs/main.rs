impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        if n < 2 {
            return 1;
        }

        let (mut a, mut b) = (1, 1);

        for _ in 2..=n {
            (a, b) = (b, a + b);
        }

        b
    }
}
