package main

func totalNumbers(digits []int) int {
	seen := make(map[int]struct{})
	n := len(digits)

	for i := range n {
		if digits[i] == 0 {
			continue
		}

		for j := range n {
			if j == i {
				continue
			}

			for k := range n {
				if k == i || k == j || digits[k] % 2 != 0 {
					continue
				}

				seen[digits[i]*100+digits[j]*10+digits[k]] = struct{}{}
			}
		}

	}

	return len(seen)
}
