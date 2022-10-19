// Solved by @kitanoyoru
// https://leetcode.com/problems/count-and-say/

package main

import (
  "strconv"
  "strings"
)

func countAndSay(n int) string {
  ans := ""

  for i := 0; i < n; i++ {
    if ans == "" {
      ans = "1"
      continue
    }

    var curr strings.Builder
    count := 1

    for i := 1; i < len(ans); i++ {
      if ans[i] == ans[i - 1] {
        count++
      } else {
        curr.WriteString(strconv.Itoa(count))
        curr.WriteByte(ans[i - 1])
        count = 1
      }
    }

    curr.WriteString(strconv.Itoa(count))
    curr.WriteByte(ans[len(ans) - 1])
    
    ans = curr.String()
  }

  return ans
}

