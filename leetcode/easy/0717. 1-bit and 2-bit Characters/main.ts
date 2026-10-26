function isOneBitCharacter(bits: number[]): boolean {
  let [idx, n] = [0, bits.length]

  while (idx < n - 1) {
    idx += bits[idx] + 1
  }

  return idx == n - 1
}
