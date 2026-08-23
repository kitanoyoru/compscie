// Solved by @kitanoyoru
// https://leetcode.com/problems/subarray-sum-equals-k/

const subarraySum = (nums: number[], k: number): number => {
  let hm = new Map<number, number>()
  let sum = 0,
    ans = 0,
    temp: number

  hm.set(0, 1)

  for (const num of nums) {
    sum += num
    temp = sum - k
    if (hm.has(temp)) {
      console.log(temp)
      ans += hm.get(temp)!
      console.log(ans)
    }
    if (hm.has(sum)) {
      hm.set(sum, hm.get(sum)! + 1)
    } else {
      hm.set(sum, 1)
    }
  }

  return ans
}
