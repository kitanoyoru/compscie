// Solved by @kitanoyoru
// https://leetcode.com/problems/arithmetic-subarrays/?envType=study-plan&id=programming-skills-ii


class Solution {
  public List<Boolean> checkArithmeticSubarrays(int[] nums, int[] l, int[] r) {
    List<Boolean> ans = new ArrayList<>();
    int[] subarr;
    int n = l.length;

    for (int i = 0; i < n; i++) {
      subarr = Arrays.copyOfRange(nums, l[i], r[i] + 1);
      ans.add(checkArithmetic(subarr));
    }

    return ans;
  }

  private boolean checkArithmetic(int[] arr) {
    if (arr.length <= 2) return true;

    Arrays.sort(arr);
    int d = arr[1] - arr[0];
    System.out.println(d);

    for (int i = 2; i < arr.length; i++) {
      if (arr[i] - arr[i-1] != d) {
        return false;
      }
    }

    return true;
  }
}
