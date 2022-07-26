// Solved by @kitanoyoru
// https://leetcode.com/problems/as-far-from-land-as-possible/

const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

const maxDistance = (grid: number[][]): number => {
  const rows = grid.length, columns = grid[0].length;
  let q: number[][] = [], ans = -1;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid[i][j]) {
        q.push([i, j]);
      }
    }
  }

  if (!q.length || rows * columns == q.length) {
    return -1;
  }

  while (q.length) {
    let count = q.length;
    while (count--) {
      const [row, column] = q.shift()!;
      for (let d of DIRECTIONS) {
        let newRow = row + d[0], newColumn = column + d[1];
        if (newRow >= 0 && newRow < rows && newColumn >= 0 && newColumn < columns && !grid[newRow][newColumn]) {
          q.push([newRow, newColumn]);
          grid[newRow][newColumn] = 1;
        }
      }
    }
    ans++;
  }

  return ans;
};
