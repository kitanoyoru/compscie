package main

import "sort"

func heightChecker(heights []int) int {
  current := make([]int, len(heights))
  copy(current, heights)

  sort.Ints(heights)

  result := 0
  for i, val := range current {
    if heights[i] != val {
      result++
    }
  }

  return result
}
