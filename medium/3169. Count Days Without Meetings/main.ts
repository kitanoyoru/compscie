const countDays = (days: number, meetings: number[][]): number => {
  meetings.sort((a, b) => a[0] - b[0]);

  let merged: number[][] = [];

  for (let meet of meetings) {
    if (merged.length > 0 && merged[merged.length - 1][1] >= meet[0]) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], meet[1]);
    } else {
      merged.push(meet);
    }
  }

  let result = 0;
  for (let meet of merged) {
    result += meet[1] - meet[0] + 1;
  }

  return days - result;
};
