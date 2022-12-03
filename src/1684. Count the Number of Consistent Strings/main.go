// Solved by @kitanoyoru

package main

import "strings"

func countConsistentStrings(allowed string, words []string) int {
  ans := 0

  for _, word := range words {
    for _, ch := range word {
      res := strings.ContainsRune(allowed, ch)
      if !res {
        ans--
        break
      }
    }
    ans++
  }

  return ans
}
