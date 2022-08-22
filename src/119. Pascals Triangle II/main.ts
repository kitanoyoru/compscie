// Solved by @kitanoyoru
// https://leetcode.com/problems/pascals-triangle-ii/

const getRow = (rowIndex: number): number[] => {
  if (rowIndex == 0) {
    return [1]
  }
  if (rowIndex == 1) {
    return [1, 1]
  }
  let prevRow: number[] = [1, 1]
  let curRow: number[] = []

  for (let i = 1; i < rowIndex; i++) {
    curRow = []
    curRow.unshift(1)
    for (let j = 1; j < prevRow.length; j++) {
      curRow.push(prevRow[j] + prevRow[j - 1])
    }
    curRow.push(1)

    prevRow = [...curRow]
  }

  return curRow
}
