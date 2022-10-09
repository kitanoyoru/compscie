func searchRange(nums []int, target int) []int {
  start := binarySearch(nums, target, true)
  
  if start == -1 {
    return []int {-1, -1}
  }

  end := binarySearch(nums, target, false)

  return []int {start, end}
}

func binarySearch(nums []int, target int, isFindingStart bool) int {
  left, right, ans := 0, len(nums) - 1, -1

  for left <= right {
    mid := left + (right - left) / 2

    if nums[mid] == target {
      if ans == -1 {
        ans = mid
      } else {
        if isFindingStart {
          if mid < ans {
            ans = mid
          }
        } else {
          if mid > ans {
            ans = mid
          }
        }
      }

      if isFindingStart {
        right = mid - 1
      } else {
        left = mid + 1
      }
    } else if nums[mid] > target {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return ans
}
