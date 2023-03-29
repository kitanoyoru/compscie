use std::collections::HashSet;

impl Solution {
    pub fn mincost_tickets(days: Vec<i32>, costs: Vec<i32>) -> i32 {
        let days: HashSet<i32> = days.iter().cloned().collect();
        let mut dp = vec![0; 366];

        for day in 1..366 {
            let i = day as usize;
            if !days.contains(&day) {
                dp[i] = dp[i-1];
            } else {
                let c1 = (day - 1) as usize;
                let c2 = (day - 7).max(0) as usize;
                let c3 = (day - 30).max(0) as usize;

                dp[i] = (dp[c1] + costs[0]).min(dp[c2] + costs[1]).min(dp[c3] + costs[2]);
            }
        }

        dp[365]
    }
}