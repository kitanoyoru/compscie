// Solved by @kitanoyoru
// https://leetcode.com/problems/guess-number-higher-or-lower/

const guessNumber = (n: number) => {
  let start = 0,
    end = n

  while (start <= end) {
    const mid = Math.floor(start + (end - start) / 2)
    const guessAnswer = guess(mid)

    if (guessAnswer == 0) {
      return mid
    } else if (guessAnswer == 1) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return 0
}
