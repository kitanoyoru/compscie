// Solved by @kitanoyoru
// https://leetcode.com/problems/arranging-coins/


// binary search version
const arrangeCoins = (n: number): number => {
  let start = 0, mid = 0, money = 0, end = n;
  while (start <= end) {
    mid = start + Math.floor((end - start) / 2);
    money = Math.floor(mid * (mid + 1) / 2);
    if (money == n) {
      return mid;
    } else if (n < money) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }

  return end;
};


