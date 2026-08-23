use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn minimum_effort_path(heights: Vec<Vec<i32>>) -> i32 {
        let directions = [(-1, 0), (0, 1), (1, 0), (0, -1)];
        let (rows, cols) = (heights.len(), heights[0].len());

        let mut dist = vec![vec![i32::MAX; cols]; rows];
        dist[0][0] = 0;

        let mut q: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
        q.push(Reverse((0, 0, 0)));

        while let Some(Reverse((effort, x, y))) = q.pop() {
            if x == rows - 1 && y == cols - 1 {
                return effort;
            }

            for (dx, dy) in &directions {
                let nx = (x as i32 + dx) as usize;
                let ny = (y as i32 + dy) as usize;
                if nx >= 0 && nx < rows && ny >= 0 && ny < cols {
                    let neffort = effort.max((heights[x][y] - heights[nx][ny]).abs());
                    if neffort < dist[nx][ny] {
                        dist[nx][ny] = neffort;
                        q.push(Reverse((neffort, nx, ny)));
                    }
                }
            }
        }

        unreachable!();
    }
}
