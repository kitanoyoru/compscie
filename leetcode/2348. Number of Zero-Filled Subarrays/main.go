package main

func zeroFilledSubarray(nums []int) int64 {
	current_zero_subarray, all_zero_subarrays := int64(0), int64(0)

	for _, num := range nums {
		if num == 0 {
			current_zero_subarray++
			all_zero_subarrays += current_zero_subarray
		} else {
			current_zero_subarray = 0
		}
	}

	return all_zero_subarrays
}
