package main

func minimumReplacement(nums []int) int64 {
	n := len(nums)

	last := nums[n-1]
	ans := int64(0)

	for i := n - 2; i >= 0; i-- {
		if nums[i] > last {
			temp := nums[i] / last
			if nums[i]%last != 0 {
				temp++
			}
			last = nums[i] / temp
			ans += int64(temp - 1)
		} else {
			last = nums[i]
		}
	}

	return ans
}
