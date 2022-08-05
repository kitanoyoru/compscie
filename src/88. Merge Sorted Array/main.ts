// Solved by @kitanoyoru
// https://leetcode.com/problems/merge-sorted-array/

/**
 Do not return anything, modify nums1 in-place instead.
 */
const merge = (
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void => {
  let i = m - 1
  let j = n - 1
  let last = nums1.length

  while (i >= 0 || j >= 0) {
    last--
    if ((nums1[i] >= nums2[j] && i >= 0) || j < 0) {
      nums1[last] = nums1[i]
      i--
      continue
    }
    if ((nums1[i] < nums2[j] && j >= 0) || i < 0) {
      nums1[last] = nums2[j]
      j--
      continue
    }
  }
}
