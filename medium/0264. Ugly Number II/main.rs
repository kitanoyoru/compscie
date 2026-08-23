impl Solution {
    pub fn nth_ugly_number(n: i32) -> i32 {
        let mut dp = vec![0; n as usize];

        dp[0] = 1;

        let (mut p1, mut p2, mut p3) = (0, 0, 0);
        
        for i in 1..n as usize {
            let two = dp[p1] * 2;
            let three = dp[p2] * 3;
            let five = dp[p3] * 5;

            dp[i] = two.min(three).min(five);

            if dp[i] == two { p1 += 1 }
            if dp[i] == three { p2 += 1 }
            if dp[i] == five { p3 += 1 }
        }

        dp[(n - 1) as usize]
    }
}

