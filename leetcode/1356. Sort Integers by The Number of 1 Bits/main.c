#include <stdlib.h>

int countSetBits(int n) {
  int count = 0;

  while (n) {
    n &= (n - 1);
    count++;
  }

  return count;
}

int compare(const void *a, const void *b) {
  int x = *(const int*)a;
  int y = *(const int*)b;

  int bitsX = countSetBits(x);
  int bitsY = countSetBits(y);

  if (bitsX == bitsY) {
    return x - y;
  }

  return bitsX - bitsY;
}

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* sortByBits(int* arr, int arrSize, int* returnSize) {
  int* result = (int*)malloc(sizeof(int) * arrSize);
  for (int i = 0; i < arrSize; i++) {
    result[i] = arr[i];
  }

  qsort(result, arrSize, sizeof(int), compare);

  *returnSize = arrSize;

  return result;
}
