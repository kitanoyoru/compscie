const zeroFilledSubarray = (nums: number[]): number => {
  let [currentZeroSubarray, allZeroSubarrays] = [0, 0]

  for (const num of nums) {
    if (num == 0) {
      currentZeroSubarray++
      allZeroSubarrays += currentZeroSubarray
    } else {
      currentZeroSubarray = 0
    }
  }

  return allZeroSubarrays
}
