// Solved by @kitanoyoru
// https://leetcode.com/problems/reordered-power-of-2/

const reorderedPowerOf2 = (n: number): boolean => {
  const powerOfTwos = new Array(31).fill(0).map((_, i) =>
    String(2 ** i)
      .split("")
      .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
      .join("")
  )
  const find = n
    .toString()
    .split("")
    .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
    .join("")

  for (const num of powerOfTwos) {
    if (num == find) {
      return true
    }
  }

  return false
}
