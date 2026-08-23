impl Solution {
    pub fn min_path_sum(grid: Vec<Vec<i32>>) -> i32 {
        let (rows, cols) = (grid.len(), grid[0].len());

        let mut grid = grid;
        
        for row in 0..rows {
            for col in 0..cols {
                if row == 0 && col == 0 {
                    continue;
                } else if row == 0 && col != 0 {
                    grid[row][col] += grid[row][col-1];
                } else if row != 0 && col == 0 {
                    grid[row][col] += grid[row-1][col];
                } else {
                    grid[row][col] = std::cmp::min(grid[row-1][col], grid[row][col-1]);
                }

            }
        }

        grid[rows-1][cols-1]
    }
}