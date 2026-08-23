#include <stdlib.h>

int min(int a, int b, int c) {
  if (a < b) {
    return (a < c) ? a : c;
  } else {
    return (b < c) ? b : c; 
  }
}

int nthUglyNumber(int n) {
  int *nums = (int*)malloc(n * sizeof(int));

  nums[0] = 1;

  int i2 = 0, i3 = 0, i5 = 0;
  int next_2 = 2, next_3 = 3, next_5 = 5;

  for (int i = 1; i < n; i++) {
    int next_value = min(next_2, next_3, next_5);

    nums[i] = next_value;

    if (next_value == next_2) {
      i2++;
      next_2 = nums[i2] * 2;
    }
    if (next_value == next_3) {
      i3++;
      next_3 = nums[i3] * 3;
    }
    if (next_value == next_5) {
      i5++;
      next_5 = nums[i5] * 5;
    }
  }

  int result = nums[n - 1];
  free(nums);

  return result;
}
