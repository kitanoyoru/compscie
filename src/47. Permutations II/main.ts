// Solved by @kitanoyoru
// https://leetcode.com/problems/permutations-ii/

const permuteUnique = (nums: number[]): number[][] => {
  const ans: number[][] = [];

  const dfs = (arr: number[], rest: number[]) => {
    if (!rest.length) {
      ans.push(arr);
      return;
    }

    let num = new Set();
    for (let i = 0; i < rest.length; i++) {
      if (num.has(rest[i])) continue;
      num.add(rest[i]);
      dfs([...arr, rest[i]], [...rest.filter((_, idx) => idx != i)]);
    }
  }
  
  dfs([], nums);

  return ans;
};
