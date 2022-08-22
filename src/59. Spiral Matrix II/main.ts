// Solved by @kitanoyoru
// https://leetcode.com/problems/spiral-matrix-ii/

const initZeroMatrix = (n: number) => {
  let matrix: number[][] = []
  for (let i = 0; i < n; i++) {
    matrix.push([])
    for (let j = 0; j < n; j++) {
      matrix[i].push(0)
    }
  }

  return matrix
}

const generateMatrix = (n: number): number[][] => {
  let matrix = initZeroMatrix(n)

  let top = 0,
    bottom = n - 1
  let left = 0,
    right = n - 1

  let counter = 1

  while (left <= right && top <= bottom) {
    for (let i = left; i <= right; i++) {
      matrix[top][i] = counter
      counter++
    }
    top++
    for (let i = top; i <= bottom; i++) {
      matrix[i][right] = counter
      counter++
    }
    right--
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        matrix[bottom][i] = counter
        counter++
      }
      bottom--
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        matrix[i][left] = counter
        counter++
      }
      left++
    }
  }

  return matrix
}
