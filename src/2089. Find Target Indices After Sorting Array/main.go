func targetIndices(nums []int, target int) []int {
  var ans []int = make([]int, 0)

  count, pos := 0, 0

  for i := 0; i < len(nums); i++ {
    if nums[i] == target {
      count++
    }

    if nums[i] < target {
      pos++
    }
  }

  for i := 0; i < count; i++ {
    ans = append(ans, pos)
    pos++
  }

  return ans
}
