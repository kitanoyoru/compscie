function findMaxConsecutiveOnes(nums: number[]): number {
  let [counter, result] = [0, 0]

  for (const num of nums) {
    if (num == 1) {
      counter++
    } else {
      result = max(result, counter)
      counter = 0
    }
  }

  if (counter != 0) {
    result = max(result, counter)
  }

  return result
}

function max(a: number, b: number): number {
  return a > b ? a : b
}
