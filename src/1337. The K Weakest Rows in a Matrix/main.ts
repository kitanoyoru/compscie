// Solved by @kitanoyoru
// https://leetcode.com/problems/the-k-weakest-rows-in-a-matrix/

const kWeakestRows = (mat: number[][], k: number) => {
  let m: number[][] = []

  for (let i = 0; i < mat.length; i++) {
    let row = mat[i]
    let start = 0,
      end = row.length - 1
    while (start <= end) {
      let mid = start + Math.floor((end - start) / 2)
      if (row[mid]) {
        start = mid + 1
      } else if (!row[mid]) {
        end = mid - 1
      }
    }
    m.push([i, end])
  }

  return m
    .sort((a, b) => a[1] - b[1])
    .slice(0, k)
    .map((v) => v[0])
}
