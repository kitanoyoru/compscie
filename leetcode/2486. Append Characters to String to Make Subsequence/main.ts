const appendCharacters = (s: string, t: string): number => {
  let [i, j] = [0, 0];

  while (i < s.length && j < t.length) {
    if (s.charAt(i) == t.charAt(j)) {
      j++
    }

    i++
  }

  return t.length - j
};
