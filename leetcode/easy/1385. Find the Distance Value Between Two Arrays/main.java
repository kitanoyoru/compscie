// Solved by @kitanoyoru
// https://leetcode.com/problems/find-the-distance-value-between-two-arrays/

class Solution {
  public int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
    int count = 0;

    for (int v1 : arr1) {
      for (int v2 : arr2) {
        if (Math.abs(v1 - v2) <= d) {
          count--;
          break;
        }
      }
      count++;
    }

    return count;
  }
}