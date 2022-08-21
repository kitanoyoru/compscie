// Solved by @kitanoyoru
// https://leetcode.com/problems/merge-intervals/

const merge = (intervals: number[][]): number[][] => {
  intervals.sort((a, b) => a[0] - b[0]);
  let ans: number[][] = [intervals[0]], last = 0;

  for (let i = 1; i < intervals.length; i++) {
    if (ans[last][1] < intervals[i][0]) {
      ans.push(intervals[i]);
      last++;
    } else if (ans[last][1] <= intervals[i][1]){
      ans[last][1] = intervals[i][1];
    }
  }

  return ans;
};
