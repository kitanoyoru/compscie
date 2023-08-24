// Solved by @kitanoyoru
// https://leetcode.com/problems/non-overlapping-intervals/

import java.util.Arrays;

class Solution {
  public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (v1, v2) -> (v1[1] - v2[1]));
    int end = intervals[0][1], counter = -1;
    for (var interval : intervals) {
      if (interval[0] >= end) {
        end = interval[1];
      } else {
        counter++;
      }
    }

    return counter;
  }
}
