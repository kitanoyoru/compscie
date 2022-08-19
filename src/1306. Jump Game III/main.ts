// Solved by @kitanoyoru
// https://leetcode.com/problems/jump-game-iii/

const canReach = (arr: number[], start: number): boolean => {
  let visited: boolean[] = new Array(arr.length).fill(false)
  let q: number[] = []

  q.push(start)

  while (q.length) {
    let node = q.shift()!
    if (arr[node] == 0) {
      return true
    }
    if (!visited[node]) {
      visited[node] = true

      let left = node + arr[node]
      let right = node - arr[node]

      if (arr[left] || arr[left] == 0) {
        q.push(left)
      }
      if (arr[right] || arr[right] == 0) {
        q.push(right)
      }
    }
  }

  return false
}
