// Solved by @kitanoyoru
// https://leetcode.com/problems/interval-list-intersections/

const intervalIntersection = (
  firstList: number[][],
  secondList: number[][]
): number[][] => {
  const fLen = firstList.length,
    sLen = secondList.length
  let l = 0,
    r = 0,
    ans: number[][] = []
  let right, left

  while (l < fLen && r < sLen) {
    left = Math.max(firstList[l][0], secondList[r][0])
    right = Math.min(firstList[l][1], secondList[r][1])

    if (left <= right) {
      ans.push([left, right])
    }

    if (firstList[l][1] < secondList[r][1]) {
      l++
    } else {
      r++
    }
  }

  return ans
}
