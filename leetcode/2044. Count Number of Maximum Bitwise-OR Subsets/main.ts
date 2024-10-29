const countMaxOrSubsets = (nums: number[]): number => {
  let [maxOr, result] = [0, 0];

  for (let num of nums) {
    maxOr |= num;
  }

  const backtrack = (idx: number, currOr: number) => {
    if (currOr == maxOr) {
      result += 1;
    }

    for (let i = idx; i < nums.length; i++) {
      backtrack(i + 1, currOr | nums[i]);
    }
  }

  backtrack(0, 0);

  return result
};
