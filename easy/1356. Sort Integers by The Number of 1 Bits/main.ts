function sortByBits(arr: number[]): number[] {
  return arr.sort((a, b) => {
    let [bitsA, bitsB] = [countSetBits(a), countSetBits(b)];

    if (bitsA === bitsB) {
      return a - b;
    }

    return bitsA - bitsB;
  });
}

function countSetBits(num: number): number {
  let result = 0;

  while (num) {
    result += num & 1;
    num >>= 1;
  }

  return result;
}

console.log(sortByBits([0, 1, 2, 3, 4, 5, 6, 7, 8]))
