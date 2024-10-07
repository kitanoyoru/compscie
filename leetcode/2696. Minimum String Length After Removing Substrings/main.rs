impl Solution {
    pub fn min_length(s: String) -> i32 {
        let mut stack = Vec::new();

        for c in s.chars() {
            stack.push(c);

            if stack.len() >= 2 {
                if (stack[stack.len() - 2] == 'A' && stack[stack.len() - 1] == 'B')
                    || (stack[stack.len() - 2] == 'C' && stack[stack.len() - 1] == 'D')
                {
                    stack.pop();
                    stack.pop();
                }
            }
        }

        stack.len() as i32
    }
}


