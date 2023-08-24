use std::collections::{BinaryHeap, HashMap};

impl Solution {
    pub fn reorganize_string(s: String) -> String {
        let mut m = HashMap::new();
        for ch in s.chars() {
            *m.entry(ch).or_insert(0) += 1;
        }

        let mut h: BinaryHeap<(i32, char)> = BinaryHeap::new();
        for (&ch, &freq) in m.iter() {
            h.push((freq, ch));
        }

        let mut res = Vec::new();
        while h.len() >= 2 {
            let (freq1, char1) = h.pop().unwrap();
            let (freq2, char2) = h.pop().unwrap();

            res.push(char1);
            res.push(char2);

            if freq1 > 1 {
                h.push((freq1 - 1, char1));
            }
            if freq2 > 1 {
                h.push((freq2 - 1, char2));
            }
        }

        if let Some((freq, ch)) = h.pop() {
            if freq > 1 {
                return "".to_string();
            }
            res.push(ch);
        }

        let result: String = res.into_iter().collect();

        result
    }
}
