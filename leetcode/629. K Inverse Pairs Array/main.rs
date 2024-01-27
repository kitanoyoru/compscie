const MOD: i32 = 1_000_000_007;

impl Solution {
    pub fn k_inverse_pairs(n: i32, k: i32) -> i32 {
        let mut dp = [[0; 10001]; 1001];

        dp[0][0] = 1;

        for i in 1..=n {
            for j in 0..=k {
                for x in 0..=j.min(i - 1) {
                    if j >= x {
                        dp[i as usize][j as usize] = (dp[i as usize][j as usize]
                            + dp[(i - 1) as usize][(j - x) as usize])
                            % MOD
                    }
                }
            }
        }

        dp[n as usize][k as usize]
    }
}

// another solution
//
impl Solution {
    pub fn k_inverse_pairs(n: i32, k: i32) -> i32 {
        let MOD = 1000000007;
        let mut dp = vec![0; (k + 1) as usize];
        dp[0] = 1;
        for i in 2..=n {
            for j in 1..=k {
                dp[j as usize] = (dp[j as usize] + dp[(j - 1) as usize]) % MOD;
            }
            for j in (i..=k).rev() {
                dp[j as usize] = (dp[j as usize] - dp[(j - i) as usize] + MOD) % MOD;
            }
        }
        dp[k as usize]
    }
}
