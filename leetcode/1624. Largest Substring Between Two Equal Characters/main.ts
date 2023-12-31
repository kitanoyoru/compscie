const maxLengthBetweenEqualCharacters = (s: string): number => {
  let maxLength = -1

  for (let left = 0; left < s.length; left++) {
    for (let right = left + 1; right < s.length; right++) {
      if (s[left] == s[right]) {
        let distance = right - left - 1
        maxLength = distance > maxLength ? distance : maxLength
      }
    }
  }

  return maxLength
}
