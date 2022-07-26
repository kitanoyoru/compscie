// Solved by @kitanoyoru
// https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/

const searchRange = (nums: number[], target: number): number[] => {
  let start = 0,
    end = nums.length - 1,
    mid = 0,
    ans= new Array(2)


  while (start <= end) {
    mid = start + Math.floor((end - start) / 2)
    if (nums[mid] == target) {
      ans[0] = mid
      end = mid - 1
    } else if (nums[mid] < target) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }
  
  start = 0;
  end = nums.length - 1;

  while (start <= end) {
    mid = start + Math.floor((end - start) / 2)
    if (nums[mid] == target) {
      ans[1] = mid
      start = mid + 1
    } else if (nums[mid] < target) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return ans.includes(undefined) ? [-1, -1] : ans;
}

console.log(searchRange([5, 7, 7, 8, 8, 10], 6))
