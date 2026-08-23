impl Solution {
    pub fn height_checker(heights: Vec<i32>) -> i32 {
        let mut sorted_heights = heights.clone();
        sorted_heights.sort();

        let mut result = 0;

        for (current, sorted) in heights.iter().zip(sorted_heights.iter()) {
            if current != sorted {
                result += 1;
            }
        }

        result
    }
}
