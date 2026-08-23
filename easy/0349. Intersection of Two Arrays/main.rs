use std::collections::HashSet;

impl Solution {
    pub fn intersection(nums1: Vec<i32>, nums2: Vec<i32>) -> Vec<i32> {
        let mut s1 = HashSet::new();
        let mut s2 = HashSet::new();

        for val in nums1 {
            s1.insert(val);
        }
        for val in nums2 {
            s2.insert(val);
        }

        let mut result: Vec<i32> = Vec::new();
        for val in s1 {
            if s2.contains(&val) {
                result.push(val);
            }
        }

        result
    }
}
