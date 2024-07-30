impl Solution {
    pub fn minimum_deletions(s: String) -> i32 {
        let n = s.len();

        let chars: Vec<char> = s.chars().collect();
        let mut f = vec![0; n+1];
        let mut b = 0;

        for i in 1..=n {
            if chars[i-1] == 'b' {
                f[i] = f[i-1];
                b += 1;
            } else {
                f[i] = (f[i-1] + 1).min(b);
            }
        }

        f[n]
    }
}

