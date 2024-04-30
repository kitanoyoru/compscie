use std::collections::HashMap;

impl Solution {
    pub fn is_anagram(s: String, t: String) -> bool {
        if s.len() != t.len() {
            return false;
        }

        let mut count = HashMap::new();
        for c in s.chars() {
            *count.entry(c).or_insert(0) += 1;
        }

        for c in t.chars() {
            if let Some(value) = count.get_mut(&c) {
                if *value == 0 {
                    return false;
                }

                *value -= 1
            } else {
                return false;
            }
        }

        true
    }
}
