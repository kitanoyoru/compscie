impl Solution {
    pub fn check_inclusion(s1: String, s2: String) -> bool {
        if s2.len() < s1.len() {
            return false;
        }

        let mut s1_freq = vec![0; 26];
        for &c in s1.as_bytes() {
            s1_freq[(c as usize - b'a' as usize)] += 1;
        }

        let mut s2_freq = vec![0; 26];
        for i in 0..s1.len() {
            s2_freq[(s2.as_bytes()[i] as usize - b'a' as usize)] += 1;
        }

        if Self::equals(&s1_freq, &s2_freq) {
            return true;
        }

        for i in s1.len()..s2.len() {
            let new_char_idx = (s2.as_bytes()[i] as usize - b'a' as usize);
            let old_char_idx = (s2.as_bytes()[i - s1.len()] as usize - b'a' as usize);

            s2_freq[new_char_idx] += 1;
            s2_freq[old_char_idx] -= 1;

            if Self::equals(&s1_freq, &s2_freq) {
                return true;
            }
        }

        false
    }

    fn equals(freq1: &[i32], freq2: &[i32]) -> bool {
        for i in 0..26 {
            if freq1[i] != freq2[i] {
                return false;
            }
        }
        
        true
    }
}


