class Solution {
  List<List<int>> findMatrix(List<int> nums) {
    List<List<int>> res = [];

    List<int> freq = List<int>.filled(nums.length + 1, 0);

    for (int number in nums) {
        if (freq[number] >= res.length) {
            res.add([]);
        }

        res[freq[number]].add(number);
        freq[number]++;
    }

    return res;
  }
}
