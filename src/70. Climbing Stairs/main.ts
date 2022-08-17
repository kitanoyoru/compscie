// Solved by @kitanoyoru
// https://leetcode.com/problems/climbing-stairs/

const climbStairs = (n: number): number => {
  if (n < 2) {
    return 1;
  }
  let a = 1, b = 1, c = 0;
  for (let i = 2; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }

  return c;
};
