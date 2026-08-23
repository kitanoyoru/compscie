// Solved by @kitanoyoru
// https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/

const findRotation = (mat: number[][], target: number[][]): boolean => {
  let q = true,
    w = true,
    e = true,
    r = true
  let rows = mat.length,
    columns = mat[0].length

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (mat[i][j] != target[i][j]) q = false
      if (mat[i][j] != target[rows - 1 - j][i]) w = false
      if (mat[i][j] != target[rows - 1 - i][rows - 1 - j]) e = false
      if (mat[i][j] != target[j][rows - 1 - i]) r = false
    }
  }

  return q || w || e || r
}
