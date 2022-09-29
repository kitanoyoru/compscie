// Solved by @kitanoyoru
// https://leetcode.com/problems/find-k-closest-elements/

const findClosestElements = (arr: number[], k: number, x: number): number[] => {
  let l = 0, r = arr.length - 1;

  let res = arr[0];
  let idx = 0;
  
  // find closest element to x
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    let mdiff = Math.abs(arr[m] - x), resdiff = Math.abs(res - x);
    if ((mdiff < resdiff) || (mdiff == resdiff && arr[m] < res)) {
      [res, idx] = [arr[m], m]
    }

    if (arr[m] < x) 
      l = m + 1;
    else if (arr[m] > x) 
      r = m - 1;
    else break
  }
  // two pointers
  l = r = idx;

  for (let i = 1; i < k; i++) {
    if (l == 0) {
      r++;
    } else if (r == arr.length - 1 || x - arr[l - 1] <= arr[r + 1] - x) {
      l--;      
    } else {
      r++; 
    }
  }

  return arr.slice(l, r + 1);
};
