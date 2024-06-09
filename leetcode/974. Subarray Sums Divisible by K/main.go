package main

func subarraysDivByK(nums []int, k int) int {
  m := make(map[int]int)
  m[0] = 1
  sum, result := 0, 0

  for _, num := range nums {
    sum += num
    rem := sum % k

    if rem < 0 {
      rem += k
    }

    if val, exists := m[rem]; exists {
      result += val
      m[rem] = val + 1
    } else {
      m[rem] = 1
    }
  }

  return result
}

