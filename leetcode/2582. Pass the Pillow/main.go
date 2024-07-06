package main

func passThePillow(n int, time int) int {
  round := (time / (n - 1)) % 2 == 0

  if round {
    return (time % (n - 1)) + 1
  }

  return n - (time % (n - 1))
}


