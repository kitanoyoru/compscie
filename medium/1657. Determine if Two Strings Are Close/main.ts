const closeStrings = (word1: string, word2: string): boolean => {
  if (word1.length != word2.length) {
    return false
  }

  let [firstFreq, secondFreq] = [new Array(26).fill(0), new Array(26).fill(0)]

  for (let i = 0; i < word1.length; i++) {
    firstFreq[word1.charCodeAt(i) - "a".charCodeAt(0)]++
    secondFreq[word2.charCodeAt(i) - "a".charCodeAt(0)]++
  }

  for (let i = 0; i < 26; i++) {
    if (
      (firstFreq[i] == 0 && secondFreq[i] > 0) ||
      (firstFreq[i] > 0 && secondFreq[i] == 0)
    ) {
      return false
    }
  }

  firstFreq.sort()
  secondFreq.sort()

  for (let i = 0; i < 26; i++) {
    if (firstFreq[i] != secondFreq[i]) {
      return false
    }
  }

  return true
}
