// Solved by @kitanoyoru
// https://github.com/kitanoyoru

const plusOne = (digits: number[]): number[] => {
  let incNum = BigInt(digits.join("")) + 1n;
  return incNum.toString().split("").map(v => Number(v));
};

