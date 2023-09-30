impl Solution {
    pub fn find132pattern(nums: Vec<i32>) -> bool {
        let mut stack = Vec::new();
        let mut last = i32::MIN;

        for &num in nums.iter().rev() {
            if num < last {
                return true;
            }

            while let Some(&top) = stack.last() {
                if top < num {
                    last = stack.pop().unwrap();
                } else {
                    break;
                }
            }

            stack.push(num);
        }

        false
    }
}
