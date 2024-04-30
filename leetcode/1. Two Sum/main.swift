class Solution {
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        var dict = [Int: Int]()

        for (i, num) in nums.enumerated() {
            if let idx = dict[target - num] {
                return [idx, i]
            }

            dict[num] = i
        }

        return []
    }
}
