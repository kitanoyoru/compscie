function mirrorDistance(n: number): number {
  return Math.abs(n - reverse(n))
}

function reverse(value: number): number {
  let result = 0;

  while (value !== 0) {
    const digit = value % 10;
    result = result * 10 + digit;
    value = Math.trunc(value / 10);
  }

  return result;
} 
