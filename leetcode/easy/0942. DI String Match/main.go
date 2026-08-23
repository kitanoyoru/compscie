package main

func diStringMatch(s string) []int {
	n := len(s)

	lower, higher := 0, n

	perm := make([]int, n+1)

	var checkIOrD func(idx int)
	checkIOrD = func(idx int) {
		if idx == n || s[idx] == 'I' {
			perm[idx] = lower
			lower++
		} else {
			perm[idx] = higher
			higher--
		}
	}

	for i := 0; i <= n; i++ {
		checkIOrD(i)
	}

	return perm
}
