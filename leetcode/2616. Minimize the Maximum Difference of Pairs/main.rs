impl Solution {
    fn is_possible_to_form(nums: &Vec<i32>, mut p: i32, diff: i32) -> bool {
        let mut i = 0;

        while i < nums.len() - 1 && p > 0 {
            if nums[i + 1] - nums[i] <= diff {
                p -= 1;
                i += 2;
            } else {
                i += 1
            }
        }

        p <= 0
    }

    pub fn minimize_max(mut nums: Vec<i32>, p: i32) -> i32 {
        nums.sort();

        let (mut left, mut right) = (0, nums[nums.len() - 1] - nums[0]);

        while left < right {
            let mid = left + (right - left) / 2;
            if Self::is_possible_to_form(&nums, p, mid) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        left
    }
}
