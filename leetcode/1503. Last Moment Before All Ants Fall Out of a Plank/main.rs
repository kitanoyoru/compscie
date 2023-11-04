impl Solution {
    pub fn get_last_moment(n: i32, left: Vec<i32>, right: Vec<i32>) -> i32 {
        let mut result = 0;

        for v in right {
            result = result.max(n - v)
        }
        for v in left {
            result = result.max(v)
        }

        result
    }
}
