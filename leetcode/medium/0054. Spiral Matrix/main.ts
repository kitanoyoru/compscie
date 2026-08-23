// Solved by @kitanoyoru
// https://leetcode.com/problems/spiral-matrix/

const spiralOrder = (matrix: number[][]): number[] => {
  let rows = matrix.length,
    columns = matrix[0].length
  let ans: number[] = []

  let x = 0,
    y = 0

  while (rows && columns) {
    if (rows == 1) {
      for (let i = 0; i < columns; i++) {
        ans.push(matrix[x][y++])
      }
      break
    } else if (columns == 1) {
      for (let i = 0; i < rows; i++) {
        ans.push(matrix[x++][y])
      }
      break
    }

    // top - right
    for (let i = 0; i < columns - 1; i++) {
      ans.push(matrix[x][y++])
    }
    // right - bottom
    for (let i = 0; i < rows - 1; i++) {
      ans.push(matrix[x++][y])
    }
    // bottom - left
    for (let i = 0; i < columns - 1; i++) {
      ans.push(matrix[x][y--])
    }
    // left - top
    for (let i = 0; i < rows - 1; i++) {
      ans.push(matrix[x--][y])
    }

    x++
    y++
    rows -= 2
    columns -= 2
  }

  return ans
}

console.log(
  spiralOrder([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ])
)
