// Solved by @kitanoyoru
// https://leetcode.com/problems/first-bad-version/submissions/

/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */

public class Solution extends VersionControl {
    public int firstBadVersion(int n) {
      int start = 1, end = n, mid, ans = -1;

      while (start <= end) {
        mid = start + (end - start) / 2;
        if (isBadVersion(mid)) {
          ans = mid;
          end = mid - 1;
        } else {
          start = mid + 1;
        }
      }

      return ans;
    }
}
