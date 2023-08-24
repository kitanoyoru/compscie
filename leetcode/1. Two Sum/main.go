func twoSum(nums []int, target int) []int {
	n := len(nums)
	m := make(map[int]int)

	for i := 0; i < n; i++ {
		if j, ok := m[target-nums[i]]; ok {
			return []int{i, j}
		}
		m[nums[i]] = i
	}

	return []int{-1, -1}
}
