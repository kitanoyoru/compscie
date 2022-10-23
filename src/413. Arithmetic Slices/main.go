// Solved by @kitanoyoru
// https://leetcode.com/problems/arithmetic-slices

func numberOfArithmeticSlices(nums []int) int {
  if len(nums) == 0 {
    return 0
  }

  diff, ans := 0, 0

  for i := 0; i < len(nums) - 2; i++ {
    diff = nums[i+1] - nums[i]
    for j := i + 2; j < len(nums); j++ {
      if nums[j] - nums[j-1] == diff {
        ans++
      } else {
        break
      }
    }
  }

  return ans 
}
