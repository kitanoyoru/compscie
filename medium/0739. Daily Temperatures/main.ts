// Solved by @kitanoyoru
// https://leetcode.com/problems/daily-temperatures/

const dailyTemperatures = (temperatures: number[]): number[] => {
  let ans: number[] = [],
    flag = true
  for (let i = 0; i < temperatures.length; i++) {
    flag = true
    for (let j = i; j < temperatures.length; j++) {
      if (temperatures[j] > temperatures[i]) {
        ans.push(j - i)
        flag = false
        break
      }
    }
    if (flag) {
      ans.push(0)
    }
  }

  return ans
}
