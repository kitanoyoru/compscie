// Solved by @kitanoyoru
// https://leetcode.com/problems/reshape-the-matrix/

const matrixReshape = (mat: number[][], r: number, c: number): number[][] => {
  if ((mat.length * mat[0].length) / c != r) {
    return mat
  }

  let ans: number[][] = []
  let row = 0,
    col = 0

  for (let i = 0; i < r; i++) {
    ans.push([])
    for (let j = 0; j < c; j++) {
      ans[i].push(mat[row][col])
      if (col == mat[row].length - 1) {
        row++
        col = 0
      } else {
        col++
      }
    }
  }

  return ans
}
