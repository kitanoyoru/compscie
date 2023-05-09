impl Solution {
    pub fn diagonal_sum(mat: Vec<Vec<i32>>) -> i32 {
            let n = mat.len();
            let mut result = 0;

            for i in 0..n {
                result += mat[i][i];
                if i != n - i - 1 {
                    result += mat[i][n-i-1];
                }
            }

            result
    }
}