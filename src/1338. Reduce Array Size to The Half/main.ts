// Solved by @kitanoyoru
// https://leetcode.com/problems/reduce-array-size-to-the-half/

const initHm = (arr: number[]) => {
  const hm: Map<number, number> = new Map();
  for (const num of arr) {
    if (hm.has(num)) {
      hm.set(num, hm.get(num)! + 1);
    } else {
      hm.set(num, 1);
    }
  }

  return hm;
};

const minSetSize = (arr: number[]): number => {
  const hm = initHm(arr);
  const sortedValues = [...hm.values()].sort((a, b) => b - a);
    
  for (let counter = 0, i = 0; i < sortedValues.length; i++) {
    counter += sortedValues[i];
    if (counter >= Math.floor(arr.length / 2)) {
      return i + 1;
    }
  }

  return 0;
};

console.log(minSetSize([3,3,3,3,5,5,5,2,2,7]));
console.log(minSetSize([1, 9]));

export {}
