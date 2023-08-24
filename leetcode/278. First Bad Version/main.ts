// Solved by @kitanoyoru
// https://leetcode.com/problems/first-bad-version/

/**
 * The knows API is defined in the parent class Relation.
 * isBadVersion(version: number): boolean {
 *     ...
 * };
 */

var solution = function (isBadVersion: any) {
  return function (n: number): number {
    let start = 1,
      end = n,
      mid = 0,
      ans = -1

    while (start <= end) {
      mid = start + Math.floor((end - start) / 2)
      if (isBadVersion(mid)) {
        end = mid - 1
        ans = mid
      } else {
        start = mid + 1
      }
    }

    return ans
  }
}
