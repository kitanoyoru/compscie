// Solved by @kitanoyoru
// https://leetcode.com/problems/product-of-array-except-self/

import java.util.Arrays;

class Solution {
  public int[] productExceptSelf(int[] nums) {
    int[] ans = new int[nums.length];
    Arrays.fill(ans, 0);

    int prod = 1;
    boolean containsZero = false;
    int counterOfZero = 0;

    for (int num : nums) {
      if (num == 0) {
        containsZero = true;
        counterOfZero++;
      } else {
        prod *= num;
      }
    }
    
    if (containsZero) {
      if (counterOfZero >= 2) {
        return ans;
      }
      for (int i = 0; counterOfZero != 0; i++) {
        if (nums[i] == 0) {
          ans[i] = prod;
          counterOfZero--;
        }
      }

      return ans;
    }

    for (int i = 0; i < nums.length; i++) {
      ans[i] = prod / nums[i];
    }

    return ans;
  }
}
