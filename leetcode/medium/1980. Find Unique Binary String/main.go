package main

func findDifferentBinaryString(nums []string) string {
	n := len(nums[0])

	m := make(map[string]struct{}, len(nums))
	for _, v := range nums {
		m[v] = struct{}{}
	}

	var (
		result string
		found  bool

		backtrack func(current string)
	)

	backtrack = func(current string) {
		if found {
			return
		}

		if len(current) == n {
			if _, ok := m[current]; !ok {
				result = current
				found = true
			}

			return
		}

		for _, v := range []string{"0", "1"} {
			backtrack(current + v)
		}
	}

	backtrack("")

	return result
}
