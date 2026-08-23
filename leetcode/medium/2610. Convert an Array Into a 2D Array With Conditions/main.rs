impl Solution {
    pub fn find_matrix(nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut result: Vec<Vec<i32>> = Vec::new();

        let mut freq = vec![0; nums.len() + 1];

        for num in nums {
            if freq[num as usize] >= result.len() {
                result.push(Vec::new());
            }

            result[freq[num as usize]].push(num);
            freq[num as usize] += 1;
        }

        result
    }
}
