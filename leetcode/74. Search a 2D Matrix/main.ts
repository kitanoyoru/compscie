// Solved by @kitanoyoru
// https://leetcode.com/problems/search-a-2d-matrix/

const searchMatrix = (matrix: number[][], target: number): boolean => {
  const arr = matrix.flat()
  let start = 0,
    end = arr.length - 1,
    mid

  while (start <= end) {
    mid = start + Math.floor((end - start) / 2)
    if (arr[mid] === target) {
      return true
    } else if (arr[mid] > target) {
      end = mid - 1
    } else {
      start = mid + 1
    }
  }

  return false
}
