const getWinner = (arr: number[], k: number): number => {
  if (k >= arr.length) {
    return Math.max(...arr)
  }

  let winner = arr[0]
  let consecutiveWins = 0

  for (let i = 1; i < arr.length; i++) {
    if (winner > arr[i]) {
      consecutiveWins++
    } else {
      winner = arr[i]
      consecutiveWins = 1
    }

    if (consecutiveWins == k) {
      break
    }
  }

  return winner
}
