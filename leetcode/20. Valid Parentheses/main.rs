impl Solution {
    pub fn is_valid(s: String) -> bool {
        let mut stack = vec![];
        for p in s.chars() {
            if p == ')' || p == ']' || p == '}' {
                if stack.is_empty() {
                    return false;
                }

                let temp = stack.last().clone();
                match p {
                    ')' => {
                        if temp != '(' {
                            return false;
                        }
                    }
                    ']' => {
                        if temp != '[' {
                            return false;
                        }
                    }
                    '}' => {
                        if temp != '{' {
                            return false;
                        }
                    }
                }

                stack.pop();
                continue;
            }

            stack.push(p);
        }

        stack.is_empty()
    }
}
