impl Solution {
    pub fn minimum_replacement(nums: Vec<i32>) -> i64 {
        let n = nums.len();

        let mut last = *nums.last().unwrap() as i64;
        let mut ans: i64 = 0;

        for &num in nums.iter().rev().skip(1) {
            let num: i64 = num as i64;

            if num > last {
                let mut temp = num / last + if num % last != 0 { 1 } else { 0 };
                last = num / temp;
                ans += (temp - 1) as i64;
            } else {
                last = num
            }
        }

        ans
    }
}
