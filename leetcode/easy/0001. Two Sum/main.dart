class Solution {
  List<int> twoSum(List<int> nums, int target) {
    for (var i in range(nums.length)) {
      for (var j in range(nums.length)) {
        if (i != j && nums[i] + nums[j] == target) {
          return [i, j];
        }
      }   
    }

    return [];
  }

  Iterable<int> range(int end) sync* {
    for (int i = 0; i < end; i++) {
      yield i;
    }
  }
}

