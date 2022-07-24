// Solved by @kitanoyoru
// https://leetcode.com/problems/find-the-distance-value-between-two-arrays/

const findTheDistanceValue = (arr1: number[], arr2: number[], d: number): number => {
  let count = 0;
  for (let v1 of arr1) {
    for (let v2 of arr2) {
      if (Math.abs(v1 - v2) <= d) {
        count--;
        break;
      }
    }
    count++;
  }
  return count;
};

console.log(findTheDistanceValue([2, 1, 100, 3], [-5, -2, 10, -3, 7], 6));