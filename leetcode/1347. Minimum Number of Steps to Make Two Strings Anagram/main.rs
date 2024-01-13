impl Solution {
    pub fn min_steps(s: String, t: String) -> i32 {
        let (mut s_freq, mut t_freq) = ([0; 26], [0; 26]);

        for c in s.chars() {
            let index = (c as u8 - b'a') as usize;
            s_freq[index] += 1;
        }

        for c in t.chars() {
            let index = (c as u8 - b'a') as usize;
            t_freq[index] += 1;
        }

        let mut steps = 0;
        for i in 0..26 {
            steps += ((s_freq[i] - t_freq[i]) as i32).abs();
        }

        steps / 2
    }
}
