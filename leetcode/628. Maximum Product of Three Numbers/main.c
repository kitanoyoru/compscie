#include <stdlib.h>

int compare(const void* a, const void* b) {
  return (*(int*)a - *(int*)b);
}

int maximumProduct(int* nums, int numsSize) {
  qsort(nums, numsSize, sizeof(int), compare);

  int first = nums[0] * nums[1] * nums[numsSize-1];
  int second = nums[numsSize-1] * nums[numsSize-2] * nums[numsSize-3];

  return (first > second) ? first : second;
}
