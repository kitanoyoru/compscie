function isUgly(n: number): boolean {
  if (n <= 0) {
    return false
  }

  for (const p of [2, 3, 5]) {
    while (n % p == 0) {
      n /= p
    }
  }

  return n == 1
}
