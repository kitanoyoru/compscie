// Solved by @kitanoyoru
// https://leetcode.com/problems/peak-index-in-a-mountain-array/

const peakIndexInMountainArray = (arr: number[]): number => {
  let start = 0,
    mid = 0,
    end = arr.length - 1

  if (arr.length >= 3) {
    while (start <= end) {
      mid = Math.floor(start + (end - start) / 2)
      if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) {
        return mid
      } else if (arr[mid] < arr[mid - 1]) {
        end = mid - 1
      } else {
        start = mid + 1
      }
    }
  }

  return -1
}
