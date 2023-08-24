// Solved by @kitanoyoru
// https://leetcode.com/problems/delete-and-earn/

const deleteAndEarn = (nums: number[]): number => {
  const n = 10001
  const arr = new Array<number>(n).fill(0)

  for (const num of nums) {
    arr[num] += num
  }

  let skip = 0,
    take = 0
  for (let i = 0; i < n; i++) {
    const take_temp = skip + arr[i]
    const skip_temp = Math.max(skip, take)

    take = take_temp
    skip = skip_temp
  }

  return Math.max(skip, take)
}
