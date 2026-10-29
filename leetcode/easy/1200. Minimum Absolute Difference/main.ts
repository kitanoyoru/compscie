function minimumAbsDifference(arr: number[]): number[][] {
  arr.sort((a, b) => a - b)

  let minDiff = Infinity
  let result: number[][] = []

  for (let i = 0; i < arr.length; i++) {
    const d = arr[i + 1] - arr[i]
    if (d < minDiff) {
      minDiff = d
      result = [[arr[i], arr[i + 1]]]
    } else if (d == minDiff) {
      result.push([arr[i], arr[i + 1]])
    }
  }

  return result
}
