impl Solution {
    pub fn array_sign(nums: Vec<i32>) -> i32 {
        let mut flag = 1;        
        for num in nums {
            if num == 0 {
                return 0;
            }
            if num < 0 {
                flag *= -1;
            }
        }

        flag
    }
}