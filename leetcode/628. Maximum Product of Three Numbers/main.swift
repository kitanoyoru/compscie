class Solution {
    func maximumProduct(_ nums: [Int]) -> Int {
        let sortedNums = nums.sorted();

        let n = sortedNums.count;

        let first = sortedNums[0] * sortedNums[1] * sortedNums[n-1];
        let second = sortedNums[n-1] * sortedNums[n-2] * sortedNums[n-3];

        return max(first, second);
    }
}
