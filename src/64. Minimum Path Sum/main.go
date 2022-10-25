// Solved by @kitanoyoru
// https://leetcode.com/problems/minimum-path-sum/

package main

func min(a, b int) int {
  if a < b {
    return a
  }
  return b
}

func minPathSum(grid [][]int) int {
  rows, cols := len(grid), len(grid[0])

  for row := 0; row < rows; row++ {
    for col := 0; col < cols; col++ {
      if row == 0 && col == 0 {
        continue
      } else if row == 0 && col != 0 {
        grid[row][col] += grid[row][col-1]
      } else if col == 0 && row != 0 {
        grid[row][col] += grid[row-1][col]
      } else {
        grid[row][col] += min(grid[row][col-1], grid[row-1][col])
      }
    }
  }

  return grid[rows-1][cols-1]
}

