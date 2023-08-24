impl Solution {
    pub fn is_alien_sorted(words: Vec<String>, order: String) -> bool {
        use std::cmp::Ordering;
        use std::collections::HashMap;

        let mut m = HashMap::<usize, i32>::new(); 
        for (i, c) in order.bytes().enumerate() {
            m.insert((c - b'a') as usize, i)
        }

        let compare = |a: &[u8], b: &[u8]| -> bool {
            for i in 0..a.len().min(b.len()) {
                let a_pos = (a[i] - b'a') as usize;
                let b_pos = (b[i] - b'a') as usize;

                match m[a_pos].unwrap().cmp(&m[b_pos].unwrap()) {
                    Ordering::Greater => return false,
                    Ordering::Less => return true,
                    Ordering::Equal => (),
                }
            }

            a.len() <= b.len()
        };


        for i in 1..words.len() {
            if !compare(words[i-1].as_bytes(), words[i].as_bytes()) {
                return false;
            }
        }

        true
    }
}