package main

func minimumDeletions(s string) int {
  n := len(s)
  b := 0

  f := make([]int, n + 1)

  for i := 1; i <= n; i++ {
    if s[i-1] == 'b' {
      f[i] = f[i-1]
      b++
    } else {
      f[i] = min(f[i-1] + 1, b)
    }
  }

  return f[n]
}

func min(a, b int) int {
  if a < b {
    return a
  }

  return b
}

