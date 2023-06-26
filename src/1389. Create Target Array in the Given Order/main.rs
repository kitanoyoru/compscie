impl Solution {
    pub fn create_target_array(nums: Vec<i32>, index: Vec<i32>) -> Vec<i32> {
        index
            .iter()
            .zip(nums.iter())
            .fold(Vec::with_capacity(nums.len()), |mut acc, (&i, &num)| {
                acc.insert(i as usize, num);
                acc
            })
    }
}
