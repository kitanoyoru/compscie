impl Solution {
    pub fn search_matrix(matrix: Vec<Vec<i32>>, target: i32) -> bool {
        let (n, m) = (matrix.len(), matrix[0].len());

        for row in &matrix {
            if target < row[0] || target > row[m - 1] {
                continue;
            } else {
                let (mut start, mut end) = (0, m - 1);
                while start <= end {
                    let mid = start + (end - start) / 2;
                    if row[mid] == target {
                        return true;
                    }

                    if row[mid] < target {
                        start = mid + 1;
                    } else {
                        end = mid - 1;
                    }
                }
            }
        }

        false
    }
}
