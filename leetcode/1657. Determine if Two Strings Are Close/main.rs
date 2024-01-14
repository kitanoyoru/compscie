impl Solution {
    pub fn close_strings(word1: String, word2: String) -> bool {
        if word1.len() != word2.len() {
            return false;
        }

        let (mut first_freq, mut second_freq) = ([0; 26], [0; 26]);

        for c in word1.chars() {
            let idx = (c as u8 - b'a') as usize;
            first_freq[idx] += 1;
        }

        for c in word2.chars() {
            let idx = (c as u8 - b'a') as usize;
            second_freq[idx] += 1;
        }

        for i in 0..26 {
            if (first_freq[i] == 0 && second_freq[i] > 0)
                || (first_freq[i] > 0 && second_freq[i] == 0)
            {
                return false;
            }
        }

        first_freq.sort();
        second_freq.sort();

        first_freq == second_freq
    }
}
