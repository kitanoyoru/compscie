use std::collections::HashMap;

impl Solution {
    pub fn first_complete_index(arr: Vec<i32>, mat: Vec<Vec<i32>>) -> i32 {
        let mut num_to_idx = HashMap::new();
        for (i, &v) in arr.iter().enumerate() {
            num_to_idx.insert(v, i);
        }

        let rows = mat.len();
        let cols = mat[0].len();

        let mut result = i32::MAX;

        for row in 0..rows {
            let mut last_idx = i32::MIN;
            for col in 0..cols {
                if let Some(&idx) = num_to_idx.get(&mat[row][col]) {
                    last_idx = last_idx.max(idx as i32);
                }
            }

            result = result.min(last_idx);
        }

        for col in 0..cols {
            let mut last_idx = i32::MIN;
            for row in 0..rows {
                if let Some(&idx) = num_to_idx.get(&mat[row][col]) {
                    last_idx = last_idx.max(idx as i32);
                }
            }

            result = result.min(last_idx);
        }

        result
    }
}

