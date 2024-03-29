// Solved by @kitanoyoru

int minimumAverageDifference(int* nums, int numsSize){
  long long front = 0, end = 0;
  int min_avg = INT_MAX, ans = 0;

  for (int i = 0; i < numsSize; i++)
    end += nums[i];

  for (int i = 0; i < numsSize; i++) {
    front += nums[i];
    end -= nums[i];

    int first = front / (i + 1);
    int second = i == numsSize - 1 ? 0 : end / (numsSize - 1 - i);
    
    int temp = abs(first - second);
    if (temp < min_avg) {
      min_avg = temp;
      ans = i;
    }
  }
  
  return ans;
}
