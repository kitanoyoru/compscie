const minimumTotal = (triangle: number[][]) => {
  let rows = triangle[triangle.length - 1].length

  if (rows == 1) {
    return triangle[0][0]
  }

  let bottom = triangle[rows - 1]

  for (let i = rows - 2; i >= 0; i--) {
    let curr = new Array(i + 1).fill(0)
    for (let j = 0; j < i + 1; j++) {
      let smallest = Math.min(bottom[j], bottom[j + 1])
      curr[j] = triangle[i][j] + smallest
    }
    bottom = curr
  }

  return bottom
}
