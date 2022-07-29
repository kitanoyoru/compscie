// Solved by @kitanoyoru
// https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/

const searchNegativeInRow = (row: number[]): number => {
  let start = 0,
    end = row.length - 1,
    mid: number,
    prev: number = Number.MAX_VALUE,
    ans: number = -1
  while (start <= end) {
    mid = start + Math.floor((end - start) / 2)
    if (row[mid] >= 0) {
      start = mid + 1
      if (row[mid] <= prev) {
        prev = row[mid]
        ans = mid
      }
    } else if (row[mid] < 0) {
      end = mid - 1
    }
  }

  return ans == -1 ? row.length : row.length - (ans + 1)
}

const countNegatives = (grid: number[][]): number => {
  let count = 0
  for (let row of grid) {
    count += searchNegativeInRow(row)
  }

  return count
}
