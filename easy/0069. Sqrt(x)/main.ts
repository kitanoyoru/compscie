// Solved by @kitanoyoru
// https://leetcode.com/problems/sqrtx/

// simple solution
const mySqrtMark1 = (x: number): number => {
  return Math.floor(x ** 0.5)
}

// too slow but idk why
const mySqrt = (x: number): number => {
  if (x <= 1) return x
  let start = 1,
    mid = 0,
    end = Math.floor(x / 2)

  while (start <= end) {
    mid = start + Math.floor(end - start)
    if (mid ** 2 == x) {
      return mid
    } else if (mid ** 2 < x) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return end
}

console.log(mySqrt(8))
console.log(mySqrt(3))
console.log(mySqrt(4))
console.log(mySqrt(10))
