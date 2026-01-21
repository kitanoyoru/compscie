const minBitwiseArray = (nums: number[]): number[] => {
  return nums.map((num, idx) => {
    if (num != 2) {
      return (num - ((num + 1) & (-num - 1)) / 2);
    }

    return -1;
  })
};
