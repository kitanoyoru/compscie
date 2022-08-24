// Solved by @kitanoyoru
// https://leetcode.com/problems/search-a-2d-matrix-ii/

const searchMatrix = (matrix: number[][], target: number): boolean => {
  for (let i = 0; i < matrix[0].length; i++) {
    if (matrix[0][i] <= target) {
      let start = 0,
        mid: number,
        end = matrix.length - 1
      while (start <= end) {
        mid = start + Math.floor((end - start) / 2)
        if (matrix[mid][i] == target) {
          return true
        }
        if (matrix[mid][i] < target) {
          start = mid + 1
        } else {
          end = mid - 1
        }
      }
    }
  }

  return false
}
