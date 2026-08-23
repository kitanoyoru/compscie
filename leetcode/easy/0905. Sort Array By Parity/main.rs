impl Solution {
    pub fn sort_array_by_parity(mut nums: Vec<i32>) -> Vec<i32> {
        let (mut i, mut j) = (0, nums.len() - 1);

        while i < j {
            while i < j && nums[i] & 1 == 0 {
                i += 1;
            }
            while i < j && nums[j] & 1 == 1 {
                j -= 1;
            }

            nums.swap(i, j);
        }

        nums
    }
}
