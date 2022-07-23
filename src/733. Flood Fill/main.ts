// 733. Flood Fill solve by @kitanoyoru
// https://leetcode.com/problems/flood-fill/

const floodFill = (
  image: number[][],
  sr: number,
  sc: number,
  color: number
): number[][] => {
  let visited: boolean[][] = []
  let need: number[][] = [[sr, sc]]
  for (let i = 0; i < image.length; ++i) {
    visited.push([])
    for (let j = 0; j < image[i].length; ++j) {
      visited[i].push(false)
    }
  }

  visited[sr][sc] = true

  const procecedVertex = (x: number, y: number) => {
    if (visited[x][y + 1] === false) {
      visited[x][y + 1] = true
      if (image[x][y + 1] === image[sr][sc]) {
        need.push([x, y + 1])
        q.push([x, y + 1])
      }
    }
    if (visited[x + 1] && visited[x + 1][y] === false) {
      visited[x + 1][y] = true
      if (image[x + 1][y] === image[sr][sc]) {
        need.push([x + 1, y])
        q.push([x + 1, y])
      }
    }
    if (visited[x][y - 1] === false) {
      visited[x][y - 1] = true
      if (image[x][y - 1] === image[sr][sc]) {
        need.push([x, y - 1])
        q.push([x, y - 1])
      }
    }
    if (visited[x - 1] && visited[x - 1][y] === false) {
      visited[x - 1][y] = true
      if (image[x - 1][y] === image[sr][sc]) {
        need.push([x - 1, y])
        q.push([x - 1, y])
      }
    }
  }

  let q: number[][] = []
  q.push([sr, sc])

  while (q.length > 0) {
    const v = q.shift()
    if (v instanceof Array) {
      procecedVertex(v[0], v[1])
    }
  }

  for (let v of need) {
    image[v[0]][v[1]] = color
  }

  return image
}

const image = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
]
const sr = 1
const sc = 1
const color = 2

console.dir(floodFill(image, sr, sc, color))
