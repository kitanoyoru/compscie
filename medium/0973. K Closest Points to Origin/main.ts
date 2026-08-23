// Solved by @kitanoyoru
// https://leetcode.com/problems/k-closest-points-to-origin/

const distance = (v: number[]) => {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2)
}

const kClosest = (points: number[][], k: number): number[][] => {
  return points.sort((a, b) => distance(a) - distance(b)).slice(0, k)
}
