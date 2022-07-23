// 7. Reverse Integer solved by @kitanoyoru
// https://www.postgresql.org/docs/current/sql-delete.html

const reverse = (x: number): number => {
  const reversedX = parseInt(
    Array.from(Math.abs(x).toString())
      .reverse()
      .reduce((num, digit) => num + digit, "")
  )
  return x > 0
    ? is32bit(reversedX)
      ? reversedX
      : 0
    : is32bit(reversedX)
    ? -1 * reversedX
    : 0
}

const is32bit = (num: number): boolean => {
  return num >= -1 * Math.pow(2, 31) && num <= Math.pow(2, 31) - 1
}
