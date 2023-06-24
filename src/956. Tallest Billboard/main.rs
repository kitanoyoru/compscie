impl Solution {
    pub fn tallest_billboard(rods: Vec<i32>) -> i32 {
        let rods_sum = rods.iter().sum::<i32>();
        let mut dp = vec![-1; rods_sum as usize + 1];

        dp[0] = 0;

        for rod in &rods {
            let curr = dp.clone();
            for i in 0..=rods_sum - rod {
                if curr[i as usize] < 0 {
                    continue;
                }

                dp[(i + rod) as usize] = dp[(i + rod) as usize].max(curr[i as usize]);
                dp[(i - rod).abs() as usize] =
                    dp[(i - rod).abs() as usize].max(curr[i as usize] + rod.min(&i));
            }
        }

        dp[0]
    }
}
