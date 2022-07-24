// Solved by @kitanoyoru
// https://leetcode.com/problems/valid-perfect-square/

const isPerfectSquare = (num: number): boolean => {
  let start = 0, end = num, mid = 0;

  while (start <= end) {
    mid = Math.floor(start + (end - start) / 2);
    if (mid ** 2 == num) {
      return true;
    } else if (mid ** 2 < num) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return false;
};

console.log(isPerfectSquare(14));