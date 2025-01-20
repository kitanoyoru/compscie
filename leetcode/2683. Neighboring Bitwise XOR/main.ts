const doesValidArrayExist = (derived: number[]): boolean => {
  let original = new Array<number>(derived.length + 1);

  original[0] = 0;
  for (let i = 0; i < derived.length; i++) {
    original[i + 1] = derived[i] ^ original[i];
  }

  let checkForZero = (original[0] == original[original.length - 1]);

  original[0] = 1;
  for (let i = 0; i < derived.length; i++) {
    original[i + 1] = derived[i] ^ original[i];
  }

  let checkForOne = (original[0] == original[original.length - 1]);

  return checkForZero || checkForOne;
};
