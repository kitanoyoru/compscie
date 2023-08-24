// Solved by @kitanoyoru

struct SubrectangleQueries {
    matrix: Vec<Vec<i32>>,
}

impl SubrectangleQueries {

    fn new(rectangle: Vec<Vec<i32>>) -> Self {
        Self {
            matrix: rectangle,
        }
    }

    fn update_subrectangle(&mut self, row1: i32, col1: i32, row2: i32, col2: i32, new_value: i32) {
        for i in row1..=row2 {
            for j in col1..=col2 {
                self.matrix[i as usize][j as usize] = new_value;
            }
        }
    }

    fn get_value(&self, row: i32, col: i32) -> i32 {
        self.matrix[row as usize][col as usize]
    }
}


