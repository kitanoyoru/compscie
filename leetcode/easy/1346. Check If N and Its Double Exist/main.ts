// Solved by @kitanoyoru
// https://leetcode.com/problems/check-if-n-and-its-double-exist/

const checkIfExist = (arr: number[]): boolean => {
  let sortedDoubleValArr = arr.map((v) => v * 2).sort((a, b) => a - b)

  if (arr.filter((v) => !v).length > 1) {
    return true
  }

  for (let k of arr) {
    let start = 0,
      end = arr.length - 1
    while (start <= end) {
      let mid = start + Math.floor((end - start) / 2)
      if (sortedDoubleValArr[mid] == k && k) {
        return true
      } else if (sortedDoubleValArr[mid] < k) {
        start = mid + 1
      } else {
        end = mid - 1
      }
    }
  }

  return false
}
