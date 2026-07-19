impl Solution {
    pub fn smallest_subsequence(s: String) -> String {
        let s_bytes = s.as_bytes();

        let mut last_occurence = [0usize; 26];
        for (i, &c) in s_bytes.iter().enumerate() {
            last_occurence[(c - b'a') as usize] = i;
        }

        let mut seen = [false; 26];
        let mut stack: Vec<u8> = Vec::new();

        for (i, &c) in s_bytes.iter().enumerate() {
            let idx = (c - b'a') as usize;

            if seen[idx] {
                continue;
            }

            while let Some(&top) = stack.last() {
                if c < top && last_occurence[(top - b'a') as usize] > i {
                    stack.pop();
                    seen[(top - b'a') as usize] = false;
                } else {
                    break;
                }
            }

            stack.push(c);
            seen[idx] = true;
        }

        String::from_utf8(stack).unwrap()
    }
}
