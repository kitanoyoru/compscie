// Solved by @kitanoyoru
// https://leetcode.com/problems/intersection-of-two-arrays-ii/

const intersect = (nums1: number[], nums2: number[]): number[] => {
  let ans: number[] = [],
    i = 0,
    j = 0

  nums1.sort((a, b) => a - b)
  nums2.sort((a, b) => a - b)

  while (nums1.length > i && nums2.length > j) {
    if (nums1[i] === nums2[j]) {
      ans.push(nums1[i])
      i++
      j++
    } else if (nums1[i] > nums2[j]) {
      j++
    } else {
      i++
    }
  }

  return ans
}
