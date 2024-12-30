use std::collections::HashMap;

const MOD: i32 = 1_000_000_007;

impl Solution {
    pub fn count_good_strings(low: i32, high: i32, zero: i32, one: i32) -> i32 {
        let mut dp: HashMap<i32, i32> = HashMap::new();

        Self::dfs(0, low, high, zero, one, &mut dp)
    }

    fn dfs(
        length: i32,
        low: i32,
        high: i32,
        zero: i32,
        one: i32,
        dp: &mut HashMap<i32, i32>,
    ) -> i32 {
        if length > high {
            return 0;
        }

        if let Some(&val) = dp.get(&length) {
            return val;
        }

        let mut res = if length >= low { 1 } else { 0 };

        res += Self::dfs(length + zero, low, high, zero, one, dp);
        res %= MOD;
        res += Self::dfs(length + one, low, high, zero, one, dp);
        res %= MOD;

        dp.insert(length, res);

        res
    }
}
