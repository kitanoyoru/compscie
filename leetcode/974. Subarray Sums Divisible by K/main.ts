const subarraysDivByK = (nums: number[], k: number): number => {
  const m = new Map<number, number>()
  m.set(0, 1)

  let [sum, result, rem] = [0, 0, 0]

  for (const num of nums) {
    sum += num
    rem = sum % k

    if (rem < 0) {
      rem += k
    }

    if (m.has(rem)) {
      let val = m.get(rem)!
      result += val
      m.set(rem, val + 1)
    } else {
      m.set(rem, 1)
    }
  }

  return result
}
