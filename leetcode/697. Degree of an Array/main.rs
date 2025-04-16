use std::collections::HashMap;

impl Solution {
    pub fn find_shortest_sub_array(nums: Vec<i32>) -> i32 {
        let mut left: HashMap<i32, usize> = HashMap::new();
        let mut right: HashMap<i32, usize> = HashMap::new();
        let mut count: HashMap<i32, usize> = HashMap::new();

        for (i, &num) in nums.iter().enumerate() {
            left.entry(num).or_insert(1);
            right.insert(num, i);
            *count.entry(num).or_insert(0) += 1;
        }

        let degree = *count.values().max().unwrap();
        let mut min_length = nums.len();

        for (&num, &cnt) in count.iter() {
            if cnt == degree {
                let length = right[&num] - left[&num] + 1;
                min_length = min_length.min(length);
            }
        }

        min_length as i32
    }
}

