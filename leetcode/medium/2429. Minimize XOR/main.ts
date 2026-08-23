const  minimizeXor = (num1: number, num2: number): number => {
  let result = num1;

  let targetOnes = num2.toString(2).split('1').length - 1;
  let setOnes = result.toString(2).split('1').length - 1; 

  let currentBit = 0;

  while (targetOnes > setOnes) {
    if (!isBitSet(result, currentBit)) {
      result = setBit(result, currentBit);
      setOnes++;
    }

    currentBit++;
  }

  currentBit = 0

  while (setOnes > targetOnes) {
    if (isBitSet(result, currentBit)) {
      result = unsetBit(result, currentBit);
      setOnes--;
    }

    currentBit++;
  }

  return result;
};

const isBitSet = (x: number, bit: number): boolean => {
  return (x & (1 << bit)) != 0;
}

const setBit = (x: number, bit: number): number => {
  return (x | (1 << bit));
}

const unsetBit = (x: number, bit: number): number => {
  return (x & ~(1 << bit));
} 
