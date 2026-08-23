use std::collections::HashMap;

impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> bool {
        let m = word_dict.into_iter().collect::<HashSet<_, _>>();

        let mut dp: HashMap<String, bool> = HashMap::new();

        Self::solve(s, &m, &mut dp)
    }

    fn solve(cur: String, m: &HashMap<String, bool>, dp: &mut HashMap<String, bool>) -> bool {
        if cur.is_empty() {
            return true;
        }

        if let Some(val) = dp.get(&cur) {
            return *val;
        }

        for i in 0..cur.len() {
            let word = cur[..i + 1].to_string();
            if m.contains(&word) {
                let other = cur[i + 1..].to_string();
                if Self::solve(other, m, dp) {
                    dp.insert(cur, true);
                    return true;
                }
            }
        }

        dp.insert(cur, false);

        false
    }
}
