function prefixesDivBy5(nums: number[]): boolean[] {
  let [result, num] = [new Array<boolean>(), 0]

  for (let i = 0; i < nums.length; i++) {
    num = (2 * num + nums[i]) % 5
    result.push(num == 0)
  }

  return result
};
