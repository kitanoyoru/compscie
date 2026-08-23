// Solved by @kitanoyoru
// https://leetcode.com/problems/satisfiability-of-equality-equations/

const equationsPossible = (equations: string[]): boolean => {
  const arr = new Array<number>(26)
  for (let i = 0; i < 26; i++) {
    arr[i] = i
  }

  const find = (x: number): number => {
    return arr[x] == x ? x : find(arr[x])
  }

  for (const eq of equations) {
    if (eq[1] === "=") {
      const x = find(eq.charCodeAt(0) - 97)
      const y = find(eq.charCodeAt(3) - 97)

      if (x != y) {
        arr[x] = y
      }
    }
  }

  for (const eq of equations) {
    if (eq[1] === "!") {
      const x = find(eq.charCodeAt(0) - 97)
      const y = find(eq.charCodeAt(3) - 97)

      if (x == y) {
        return false
      }
    }
  }

  return true
}
