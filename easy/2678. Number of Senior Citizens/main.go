package main

import "strconv"

func countSeniors(details []string) int {
  res := 0
  for _, d := range details {
    v, _ := strconv.Atoi(d[12:14])
    if v > 60 {
      res++
    }
  }
  
  return res
}
