package main

func minPatches(nums []int, n int) int {
  missing, result, idx := 1, 0, 0

  for missing <= n {
    if (idx < len(nums) && nums[idx] <= missing) {
      missing += nums[idx]
      idx++
    } else {
      missing += missing
      result++
    }
  }

  return result
}
