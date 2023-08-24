impl Solution {
    pub fn reverse_bits(mut x: u32) -> u32 {
        let mut ans: u32 = 0;
        for i in 0..32 {
            ans = (ans << 1) | (x & 1);
            x >>= 1;
        }

        ans
    }
}


