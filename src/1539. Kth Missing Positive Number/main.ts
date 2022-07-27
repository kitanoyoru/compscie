// Solved by @kitanoyoru
// https://leetcode.com/problems/kth-missing-positive-number/

const findKthPositive = (arr: number[], k: number) => {
  let counter = 0;
  for (let i = 1; counter != k; i++) {
    if (!arr.includes(i)) counter++;
    if (counter === k) return i;
  }
};

