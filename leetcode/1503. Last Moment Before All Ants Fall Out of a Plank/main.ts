const getLastMoment = (n: number, left: number[], right: number[]): number => {
  let result = 0

  left.forEach((v, _) => (result = Math.max(result, v)))
  right.forEach((v, _) => (result = Math.max(result, n - v)))

  return result
}
