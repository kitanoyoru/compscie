impl Solution {
    pub fn build_array(target: Vec<i32>, n: i32) -> Vec<String> {
        let mut result = Vec::new();

        let mut curr_number = 1;
        let mut idx = 0;

        while curr_number <= n && idx < target.len() {
            let number = target[idx];

            if number == curr_number {
                result.push(String::from("Push"));
                idx += 1;
            } else {
                result.push(String::from("Push"));
                result.push(String::from("Pop"));
            }

            curr_number += 1;
        }

        result
    }
}
