// Solved by @kitanoyoru
// https://leetcode.com/problems/valid-sudoku/

const isValidSudoku = (board: string[][]): boolean => {
  return isValidRows(board) && isValidCols(board) && isValidGrids(board)
}

const isValidRows = (board: string[][]): boolean => {
  const brows = board.length
  const bcols = board[0].length

  for (let i = 0; i < brows; i++) {
    const arr = new Array(9).fill(false)
    for (let j = 0; j < bcols; j++) {
      if (board[i][j] == ".") {
        continue
      } else {
        const num = parseInt(board[i][j]) - 1
        if (!arr[num]) {
          arr[num] = true
        } else {
          return false
        }
      }
    }
  }

  return true
}

const isValidCols = (board: string[][]): boolean => {
  const brows = board.length
  const bcols = board[0].length

  for (let i = 0; i < bcols; i++) {
    const arr = new Array(9).fill(false)
    for (let j = 0; j < brows; j++) {
      if (board[j][i] == ".") {
        continue
      } else {
        const num = parseInt(board[j][i]) - 1
        if (!arr[num]) {
          arr[num] = true
        } else {
          return false
        }
      }
    }
  }

  return true
}

const isValidGrids = (board: string[][]): boolean => {
  const brows = board.length
  const bcols = board[0].length

  const grows = 3
  const gcols = 3

  for (let i = 0; i + grows <= brows; i += grows) {
    for (let j = 0; j + gcols <= bcols; j += gcols) {
      const grid = board
        .filter((_, k) => k >= i && k < i + grows)
        .map((a) => a.slice(j, j + gcols))
      const arr = new Array(9).fill(false)
      for (const k of grid) {
        for (const p of k) {
          if (p == ".") {
            continue;
          } else {
            const num = parseInt(p) - 1;
            if (!arr[num]) {
              arr[num] = true;
            } else {
              return false;
            }
          }
        }
      }
    }
  }

  return true
}

console.log(
  isValidSudoku([
    [".", ".", ".", ".", "5", ".", ".", "1", "."],
    [".", "4", ".", "3", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "3", ".", ".", "1"],
    ["8", ".", ".", ".", ".", ".", ".", "2", "."],
    [".", ".", "2", ".", "7", ".", ".", ".", "."],
    [".", "1", "5", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "2", ".", ".", "."],
    [".", "2", ".", "9", ".", ".", ".", ".", "."],
    [".", ".", "4", ".", ".", ".", ".", ".", "."],
  ])
)
