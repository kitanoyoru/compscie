// Solved by @kitanoyoru
// https://leetcode.com/problems/rotate-image/

/**
 Do not return anything, modify matrix in-place instead.
 */

const rotate = (matrix: number[][]): void => {
  let left = 0,
    right = matrix.length - 1
  while (left < right) {
    for (let i = 0; i < right - left; i++) {
      let top = left,
        bottom = right
      let topLeft = matrix[top][left + i]
      matrix[top][left + i] = matrix[bottom - i][left]
      matrix[bottom - i][left] = matrix[bottom][right - i]
      matrix[bottom][right - i] = matrix[top + i][right]
      matrix[top + i][right] = topLeft
    }
    left++
    right--
  }
}

export {}
