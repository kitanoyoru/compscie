class Solution:
    def zeroFilledSubarray(self, nums: List[int]) -> int:
        current_zero_subarray, all_zero_subarrays = 0, 0

        for num in nums:
            if num == 0:
                current_zero_subarray += 1
                all_zero_subarrays += current_zero_subarray
            else:
                current_zero_subarray = 0

        return all_zero_subarrays
