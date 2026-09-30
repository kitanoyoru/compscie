function bitwiseComplement(n: number): number {
  let mask = 1
  while (mask < n) {
    mask = mask * 2 + 1
  }

  return n ^ mask
}
