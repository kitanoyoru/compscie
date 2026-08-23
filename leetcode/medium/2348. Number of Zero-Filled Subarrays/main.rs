impl Solution {
    pub fn zero_filled_subarray(nums: Vec<i32>) -> i64 {
        let mut current_zero_subarray: i64 = 0;
        let mut all_zero_subarrays: i64 = 0;
        
        for num in nums {
            if num == 0 {
                current_zero_subarray += 1;
                all_zero_subarrays += current_zero_subarray;
            } else {
                current_zero_subarray = 0;
            }
        }

        all_zero_subarrays 
    }
}