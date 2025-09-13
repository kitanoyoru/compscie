const maxFreqSum = (s: string): number => {
  let [maxVowel, maxConsonant] = [0, 0];

  let vowels = new Set<string>(['a', 'e', 'i', 'o', 'u'])
  let frequency = new Array(26).fill(0);

  for (let char of s) {
    let idx = char.charCodeAt(0) - 'a'.charCodeAt(0);
    if (idx < 0 || idx > 26) continue;

    frequency[idx] += 1;

    if (vowels.has(char)) {
      maxVowel = Math.max(maxVowel, frequency[idx])
    } else {
      maxConsonant = Math.max(maxConsonant, frequency[idx])
    }
  }

  return maxVowel + maxConsonant;
};
