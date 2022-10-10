func search(nums []int, target int) int {
  start, end := 0, len(nums) - 1

  for start <= end {
    mid := start + (end - start) / 2
    if nums[mid] < nums[end] {
      end = mid
    } else {
      start = mid + 1
    }
  }

  pivot := end
  start, end = 0, len(nums) - 1

  if target >= nums[pivot] && target <= nums[end] {
    start = pivot
  } else {
    end = pivot
  }

  for start <= end {
    mid := start + (end - start) / 2
    if nums[mid] == target {
      return mid
    } else if target > nums[mid] {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return -1
}
