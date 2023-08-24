use std::cmp::Ordering;

impl Solution {
    fn find_pivot(nums: &Vec<i32>) -> i32 {
        let (mut left, mut right) = (0, nums.len() - 1);

        while left <= right {
            let mid = left + (right - left) / 2;

            match nums[mid].cmp(&nums[right]) {
                Ordering::Less => right = mid,
                _ => left = mid + 1,
            }
        }

        right as i32
    }

    pub fn search(nums: Vec<i32>, target: i32) -> i32 {
        let pivot = Self::find_pivot(&nums);

        let (mut left, mut right) = (0, nums.len() as i32 - 1);

        if target >= nums[pivot as usize] && target <= nums[right as usize] {
            left = pivot
        } else {
            right = pivot
        }

        while left <= right {
            let mid = left + (right - left) / 2;

            match nums[mid as usize].cmp(&target) {
                Ordering::Equal => return mid as i32,
                Ordering::Greater => right = mid - 1,
                Ordering::Less => left = mid + 1,
            }
        }

        -1
    }
}
