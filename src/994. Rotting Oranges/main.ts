// Solved by @kitanoyoru
// https://leetcode.com/problems/rotting-oranges/

type Queue = Array<{row: number, col: number}>;

const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

const orangesRotting = (grid: number[][]): number => {
  const rows = grid.length;
  const cols = grid[0].length;

  const checkCell = (row: number, col: number) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols && grid[row][col] == 1) {
      return true;
    }
    return false;
  };

  let q: Queue = [];
  let rotten = 0, fresh = 0;
  let counter = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] == 2) {
        q.push({row: i, col: j});
      } else if (grid[i][j] == 1) {
        fresh++;
      }
    }
  }

  if (fresh == 0) {
    return 0;
  }

  while (q.length) {
    let qsize = q.length;
    while (qsize--) {
      let {row, col} = q.shift()!;
      for (const d of DIRECTIONS) {
        let newRow = row + d[0];
        let newCol = col + d[1];
        if (checkCell(newRow, newCol)) {
          grid[newRow][newCol] = 2;
          q.push({row: newRow, col: newCol});
          rotten++;
          if (rotten == fresh) {
            return counter + 1;
          }
        }
      }
    }
    counter++;
  }

  return -1;
};

