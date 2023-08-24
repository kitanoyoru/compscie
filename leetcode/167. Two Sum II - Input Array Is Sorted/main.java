// Solved by @kitanoyoru
// https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/

class Solution {
  public int[] twoSum(int[] numbers, int target) {
    int start = 0, end = numbers.length - 1, sum;

    while (start <= end) {
      sum = numbers[start] + numbers[end];
      if (sum == target) {
        return new int[] {start + 1, end + 1};
      } else if (sum < target) {
        start += 1;
      } else {
        end -= 1;
      }
    }

    return null;
  }
}
