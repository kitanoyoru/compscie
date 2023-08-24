// Solved by @kitanoyoru
// https://leetcode.com/problems/find-smallest-letter-greater-than-target/

const nextGreatestLetter = (letters: string[], target: string): string => {
  let start = 0,
    end = letters.length - 1,
    mid

  while (start <= end) {
    mid = start + Math.floor(end - start)
    if (target >= letters[mid]) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return start < letters.length ? letters[start] : letters[0]
}
