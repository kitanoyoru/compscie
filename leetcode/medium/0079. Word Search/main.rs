impl Solution {
    pub fn exist(board: Vec<Vec<char>>, word: String) -> bool {
        let mut board = board;

        for i in 0..board.len() {
            for j in 0..board[0].len() {
                if Self::backtracking(&mut board, &word, 0, i as i32, j as i32) {
                    return true;
                }
            }
        }

        false
    }

    fn backtracking(board: &mut [Vec<char>], word: &str, idx: usize, i: i32, j: i32) -> bool {
        let directions = vec![
            (-1, 0), // Up
            (1, 0),  // Down
            (0, -1), // Left
            (0, 1),  // Right
        ];

        if idx == word.len() {
            return true;
        }

        if i < 0
            || i >= board.len() as i32
            || j < 0
            || j >= board[0].len() as i32
            || board[i as usize][j as usize] != word.chars().nth(idx).unwrap()
        {
            return false;
        }

        let temp = board[i as usize][j as usize];
        board[i as usize][j as usize] = '#';

        for &(dx, dy) in &directions {
            if Self::backtracking(board, word, idx + 1, i + dx, j + dy) {
                return true;
            }
        }

        board[i as usize][j as usize] = temp;

        false
    }
}

