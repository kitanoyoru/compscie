use std::collections::HashMap;

impl Solution {
    pub fn next_greater_element(nums1: Vec<i32>, nums2: Vec<i32>) -> Vec<i32> {
        let (mut num_idx, mut stack) = (HashMap::new(), vec![]);
        let mut res = vec![-1; nums1.len()];

        nums1.iter().enumerate().for_each(|(i, &num)| {
            num_idx.insert(num, i);
        });

        nums2.into_iter().for_each(|num| {
            while let Some(&last) = stack.last() {
                if last >= num {
                    break;
                }
                if let Some(idx) = num_idx.get(&stack.pop().unwrap()) {
                    res[*idx] = num;
                }
            }

            stack.push(num);
        });

        res
    }
}
