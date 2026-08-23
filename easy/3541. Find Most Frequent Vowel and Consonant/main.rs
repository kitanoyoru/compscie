impl Solution {
    pub fn max_freq_sum(s: String) -> i32 {
        let mut vowels = [0; 26];
        let mut consonants = [0; 26];

        let (mut max_vowel, mut max_consonant) = (0, 0);

        for ch in s.chars() {
            if ch < 'a' || ch > 'z' {
                continue;
            }

            let idx = (ch as u8 - b'a') as usize;

            match ch {
                'a' | 'e' | 'i' | 'o' | 'u' => {
                    vowels[idx] += 1;
                    max_vowel = max_vowel.max(vowels[idx]);
                }
                _ => {
                    consonants[idx] += 1;
                    max_consonant = max_consonant.max(consonants[idx]);
                }
            }
        }

        max_vowel + max_consonant
    }
}
