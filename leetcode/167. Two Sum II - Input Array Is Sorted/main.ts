// Solved by @kitanoyoru
// https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/

const twoSum = (numbers: number[], target: number) => {
  let start = 0,
    end = numbers.length - 1,
    sum

  while (start <= end) {
    sum = numbers[start] + numbers[end]
    if (sum === target) {
      return [start + 1, end + 1]
    } else if (sum < target) {
      start += 1
    } else {
      end -= 1
    }
  }
}
