use std::collections::HashSet;

impl Solution {
    pub fn distribute_candies(candy_type: Vec<i32>) -> i32 {
        let unique_types: HashSet<i32> = HashSet::from_iter(candy_type.iter().cloned());
        let max_allowed = candy_type.len() / 2;

        std::cmp::min(unique_types.len(), max_allowed) as i32
    }
}
