package main

func nthUglyNumber(n int) int {
  dp := make([]int, n)

  dp[0] = 1

  var p1, p2, p3 int

  for i := 1; i < n; i++ {
    two, three, five := dp[p1] * 2, dp[p2] * 3, dp[p3] * 5
    dp[i] = min(two, three, five)

    if dp[i] == two { p1++ }
    if dp[i] == three { p2++ }
    if dp[i] == five { p3++ }
  }

  return dp[n-1]
}

func min(nums ...int) int {
  res := nums[0]
  for i := 1; i < len(nums); i++ {
    if nums[i] < res {
      res = nums[i]
    }
  } 

  return res
}
