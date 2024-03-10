class Solution {
    func intersection(_ nums1: [Int], _ nums2: [Int]) -> [Int] {
        let s1 = Set(nums1)
        let s2 = Set(nums2)

        let intersection = s1.intersection(s2)

        return Array(intersection)
    }
}
