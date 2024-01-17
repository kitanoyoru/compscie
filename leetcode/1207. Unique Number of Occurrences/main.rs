use std::collections::{HashMap, HashSet};

impl Solution {
    pub fn unique_occurrences(arr: Vec<i32>) -> bool {
        let mut map = HashMap::new();
        arr.into_iter()
            .for_each(|i| *map.entry(i).or_insert(0) += 1);

        map.len() == map.values().collect::<HashSet<_>>().len()
    }
}
