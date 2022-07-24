// Solved by @kitanoyoru
// https://leetcode.com/problems/valid-perfect-square/

class Solution {
  public boolean isPerfectSquare(int num) {
    int start = 0, mid = 0, end = num;

    while (start <= end) {
      mid = start + (end - start) / 2;
      if (Math.pow(mid, 2) == num) {
        return true;
      } else if (Math.pow(mid, 2) < num) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return false;
  }
}