impl Solution {
    pub fn special_array(nums: Vec<i32>) -> i32 {
        let mut nums = nums.clone();
        nums.sort();

        let (mut start, mut end) = (0, nums.len());

        while start <= end {
            let mid = start + (end - start) / 2;
            let freq = Self::count(&nums, mid as i32);

            if mid == freq {
                return mid as i32;
            } else if freq > mid {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }

        -1
    }

    fn count(nums: &Vec<i32>, target: i32) -> usize {
        let mut counter = 0;

        for &el in nums {
            if el >= target {
                counter += 1;
            }
        }

        counter
    }
}
