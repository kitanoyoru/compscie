const longestStrChain = (words: string[]): number => {
  words.sort((a, b) => a.length - b.length);

  const dp: { [key: string]: number } = {};

  let maxChain = 0;

  for (const word of words) {
    dp[word] = 1;
    for (let i = 0; i < word.length; i++) {
      const prev = word.slice(0, i) + word.slice(i + 1);
      if (prev in dp) {
        dp[word] = Math.max(dp[word], dp[prev] + 1);
      }
    }
    maxChain = Math.max(maxChain, dp[word]);
  }

  return maxChain;
};
