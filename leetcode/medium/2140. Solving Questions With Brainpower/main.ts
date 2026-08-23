const mostPoints = (questions: number[][]): number => {
  const dp = new Array(questions.length);

  for (let i = questions.length - 1; i >= 0; i--) {
    const idx = i + questions[i][1] + 1;

    if (idx < questions.length) {
      dp[i] = dp[idx] + questions[i][0];
    } else {
      dp[i] = questions[i][0];
    }

    if (i < questions.length - 1) {
      dp[i] = Math.max(dp[i + 1], dp[i]);
    }
  }

  return dp[0];
};
