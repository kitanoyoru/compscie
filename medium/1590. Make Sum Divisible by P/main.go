package main

func minSubarray(nums []int, p int) int {
	var total int
	for _, num := range nums {
		total += num
	}

	need := total % p
	if need == 0 {
		return 0
	}

	var (
		m      = map[int]int{0: -1}
		prefix = 0
		result = len(nums)
	)

	for i, num := range nums {
		prefix = (prefix + num) % p

		target := (prefix - need + p) % p

		if idx, ok := m[target]; ok {
			if i-idx < result {
				result = i - idx
			}
		}

		m[prefix] = i
	}

	if result == len(nums) {
		return -1
	}

	return result
}
