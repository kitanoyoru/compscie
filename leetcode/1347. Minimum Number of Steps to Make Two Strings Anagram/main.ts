const minSteps = (s: string, t: string): number => {
  const [sFreq, tFreq] = [
    new Array<number>(26).fill(0),
    new Array<number>(26).fill(0),
  ]

  for (let i = 0; i < s.length; i++) {
    sFreq[s.charCodeAt(i) - "a".charCodeAt(0)]++
    tFreq[t.charCodeAt(i) - "a".charCodeAt(0)]++
  }

  let steps = 0
  for (let i = 0; i < 26; i++) {
    steps += Math.abs(sFreq[i] - tFreq[i])
  }

  return Math.floor(steps / 2)
}
