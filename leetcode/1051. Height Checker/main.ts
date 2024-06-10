const heightChecker = (heights: number[]): number => {
  let sortedHeights = [...heights].sort((a, b) => a - b);

  let result = 0;
  for (let i = 0; i < heights.length; i++) {
    if (heights[i] !== sortedHeights[i]) {
      result++;
    }
  }

  return result;
};
