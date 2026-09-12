const totalNumbers = (digits: number[]): number => {
  let seen = new Map<number, boolean>()
  const n = digits.length

  for (let i = 0; i < n; i++) {
    if (digits[i] == 0) {
      continue
    }

    for (let j = 0; j < n; j++) {
      if (i == j) {
        continue
      }

      for (let k = 0; k < n; k++) {
        if (k == i || k == j || digits[k] % 2 != 0) {
          continue
        }

        const key = digits[i] * 100 + digits[j] * 10 + digits[k]

        seen.set(key, true)
      }
    }
  }

  return seen.size
}
