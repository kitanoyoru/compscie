const minBitwiseArray = (nums: number[]): number[] => {
  return nums.map((value, _) => {
    for (let i = 0; i < value; i++) {
      if ((i | (i + 1)) === value) {
        return i
      }
    }

    return -1;
  });
};
