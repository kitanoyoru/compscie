package main

func maximumTripletValue(nums []int) int64 {
	var maxTriplet int64

	for i := range nums {
		for j := i + 1; j < len(nums); j++ {
			for k := j + 1; k < len(nums); k++ {
				maxTriplet = max(maxTriplet, int64((nums[i]-nums[j])*nums[k]))
			}
		}
	}

	return maxTriplet
}

func max(a, b int64) int64 {
	if a > b {
		return a
	}

	return b
}
