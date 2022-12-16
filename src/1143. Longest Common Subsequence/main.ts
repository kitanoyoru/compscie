// Solved by @kitanoyoru

const longestCommonSubsequence = (text1: string, text2: string): number => {
  let m: number[][] = new Array(1001);
  for (let i = 0; i < 1001; i++)
    m[i] = new Array(1001).fill(0)

  for (let i = 0; i < text1.length; i++) {
    for (let j = 0; j < text2.length; j++) {
      if (text1[i] == text2[j]) {
        m[i+1][j+1] = m[i][j] + 1;
      } else {
        m[i+1][j+1] = Math.max(m[i][j+1], m[i+1][j])
      }
    }
  }

  return m[text1.length][text2.length]
};
