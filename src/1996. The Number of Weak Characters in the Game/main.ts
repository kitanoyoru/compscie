// Solved by @kitanoyoru
// https://leetcode.com/problems/the-number-of-weak-characters-in-the-game/

const numberOfWeakCharacters = (properties: number[][]): number => {
  properties.sort((a, b) => {
    if (a[0] != b[0]) return b[0] - a[0]
    else return a[1] - b[1]
  })
  let temp = Number.MIN_SAFE_INTEGER,
    ans = 0

  for (const entry of properties) {
    if (temp > entry[1]) ans++
    else temp = entry[1]
  }

  return ans
}
