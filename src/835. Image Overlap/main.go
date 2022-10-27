// Solved by @kitanoyoru
// https://leetcode.com/problems/image-overlap/
package main

func max(a, b int) int {
  if a < b {
    return b
  }

  return a
}

func largestOverlap(img1 [][]int, img2 [][]int) int {
  d := make(map[[2]int]int)
  var a, b [][2]int
  rows, cols := len(img1), len(img1[0])

  for i := 0; i < rows; i++ {
    for j := 0; j < cols; j++ {
      if img1[i][j] == 1 {
        a = append(a, [2]int{i, j})
      }
    }
  }
  for i := 0; i < rows; i++ {
    for j := 0; j < cols; j++ {
      if img2[i][j] == 1 {
        b = append(b, [2]int{i, j})
      }
    }
  }
  
  res := 0

  for _, i := range a {
    for _, j := range b {
      k := [2]int {j[1] - i[1], j[0] - i[0]}
      d[k]++
      res = max(res, d[k])
    }
  }

  return res
}
