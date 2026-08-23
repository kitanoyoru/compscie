impl Solution {
    pub fn find_number_of_lis(nums: Vec<i32>) -> i32 {
        let (mut dp, mut longest) = (vec![(1, 1); nums.len()], 0);

        for i in 0..nums.len() {
            let (mut i_longest, mut counter) = (1, 0);
            for j in 0..i {
                if nums[j] < nums[i] {
                    i_longest = (dp[j].0 + 1).max(i_longest);
                }
            }
            for j in 0..i {
                if dp[j].0 == i_longest - 1 && nums[j] < nums[i] {
                    counter += dp[j].1;
                }
            }

            dp[i] = ((dp[i].0).max(i_longest), (dp[i].1).max(counter));
            longest = longest.max(i_longest);
        }

        dp.iter()
            .filter(|(i_longest, _)| *i_longest == longest)
            .map(|(_, counter)| counter)
            .sum()
    }
}
