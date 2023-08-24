// Solved by @kutanoyoru
// https://leetcode.com/problems/maximum-distance-between-a-pair-of-values/

const maxDistance = (nums1: number[], nums2: number[]): number => {
  let start = 0,
    end = 0,
    mid = 0,
    ans = 0
  for (let i = 0; i < nums1.length; i++) {
    start = i
    end = nums2.length - 1
    while (start < end) {
      mid = (start + end + 1) >> 1
      if (nums2[mid] >= nums1[i]) {
        start = mid
      } else {
        end = mid - 1
      }
    }
    ans = Math.max(ans, start - i)
  }

  return ans
}
