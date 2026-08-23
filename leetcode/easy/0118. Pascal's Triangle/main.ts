// Solved by @kitanoyoru
// https://leetcode.com/problems/pascals-triangle/

const generate = (numRows: number): number[][] => {
  let pascalTriangle: number[][] = []
  for (let i = 0; i < numRows; i++) {
    let row: number[] = new Array(i + 1)

    row[0] = 1
    row[i] = 1

    for (let j = 1; j < i; j++) {
      row[j] = pascalTriangle[i - 1][j - 1] + pascalTriangle[i - 1][j]
    }

    pascalTriangle.push(row)
  }

  return pascalTriangle
}

console.log(generate(5))
