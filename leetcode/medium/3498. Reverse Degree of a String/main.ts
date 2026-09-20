function reverseDegree(s: string): number {
  let result = 0;

  for (let i = 0; i < s.length; i++) {
    result += (i + 1) * (26 - (s[i].charCodeAt(0) - 97));
  }

  return result;
};
