const minChanges = (s: string): number => {
  let result = 0;

  for (let i = 0; i <= s.length - 2; i += 2) {
    let part = s.substring(i, i + 2);

    if (part == "01" || part == "10") {
      result++;
    }
  }

  return result;
};
