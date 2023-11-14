use std::cmp::{max, min};
use std::collections::HashSet;

impl Solution {
    pub fn count_palindromic_subsequence(s: String) -> i32 {
        let mut min_exist = [std::i32::MAX; 26];
        let mut max_exist = [std::i32::MIN; 26];

        for (i, &ch) in s.as_bytes().iter().enumerate() {
            let char_idx = (ch - b'a') as usize;
            min_exist[char_idx] = min(min_exist[char_idx], i as i32);
            max_exist[char_idx] = max(max_exist[char_idx], i as i32);
        }

        let mut ans = 0;

        for idx in 0..26 {
            if min_exist[idx] == std::i32::MAX || max_exist[idx] == std::i32::MIN {
                continue;
            }

            let mut unique_chars_between = HashSet::new();

            for j in (min_exist[idx] + 1)..(max_exist[idx]) {
                let ch = s.as_bytes()[j as usize];
                unique_chars_between.insert(ch);
            }

            ans += unique_chars_between.len();
        }

        ans as i32
    }
}
