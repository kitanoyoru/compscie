impl Solution {
    pub fn wonderful_substrings(word: String) -> i64 {
        let mut result: i64 = 0;

        let mut count = vec![0; 1024];
        count[0] = 1;

        let mut prefix_xor = 0;

        for c in word.chars() {
            let idx = (c as u8 - b'a') as usize;

            prefix_xor ^= 1 << idx;

            result += count[prefix_xor];

            for i in 0..10 {
                result += count[prefix_xor ^ (1 << i)];
            }

            count[prefix_xor] += 1;
        }

        result
    }
}
