impl Solution {
    pub fn find_content_children(g: Vec<i32>, s: Vec<i32>) -> i32 {
        if s.is_empty() {
            return 0;
        }

        let mut g = g;
        let mut s = s;

        g.sort();
        s.sort();

        let mut max_num = 0;

        let mut cookie_idx = s.len() as i32 - 1;
        let mut child_idx = g.len() as i32 - 1;

        while cookie_idx >= 0 && child_idx >= 0 {
            if s[cookie_idx as usize] >= g[child_idx as usize] {
                max_num += 1;
                cookie_idx -= 1;
                child_idx -= 1;
            } else {
                child_idx -= 1;
            }
        }

        max_num
    }
}
