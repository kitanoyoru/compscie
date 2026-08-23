const numberOfBeams = (bank: string[]): number => {
  let result = 0

  let prevRowBeams = 0

  for (const row of bank) {
    let currRowBeams = findBeamsInRow(row)
    if (!currRowBeams) {
      continue
    }

    result += currRowBeams * prevRowBeams
    prevRowBeams = currRowBeams
  }

  return result
}

const findBeamsInRow = (row: string): number => {
  return Array.from(row).reduce((prev, curr) => prev + parseInt(curr), 0)
}
