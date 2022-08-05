// Solved by @kitanoyoru
// https://leetcode.com/problems/next-greater-element-iii/

// can be optimized using reversed binary search

const swap = (arr: number[], i: number, j: number) => {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

const reverseSubArray = (arr: number[], start: number, end: number) => {
  const mid = Math.floor((end - start) / 2)

  for (let i = 0; i < mid; i++) {
    swap(arr, start + i, end - 1 - i)
  }
}

const nextGreaterElement = (n: number) => {
  const checkInt32 = 2147483647
  const digitsArr = n
    .toString()
    .split("")
    .map((v) => Number(v))

  let decIndex = -1
  for (let i = digitsArr.length - 1; i > 0; i--) {
    if (digitsArr[i - 1] < digitsArr[i]) {
      decIndex = i
      break
    }
  }

  if (decIndex == -1) {
    return -1
  }

  let x = digitsArr[decIndex - 1],
    indexOfSmallest = decIndex
  for (let j = decIndex + 1; j < digitsArr.length; j++) {
    if (digitsArr[j] > x && digitsArr[j] <= digitsArr[indexOfSmallest]) {
      indexOfSmallest = j
    }
  }

  swap(digitsArr, decIndex - 1, indexOfSmallest)

  reverseSubArray(digitsArr, decIndex, digitsArr.length)

  const num = Number(digitsArr.join(""))
  return num > checkInt32 ? -1 : num
}

console.log(nextGreaterElement(12))
