package main

func minimizedMaximum(n int, quantities []int) int {
	var canDistribute func(k int) bool
	canDistribute = func(k int) bool {
		stores := 0
		for _, quantity := range quantities {
			stores += quantity / k
			if quantity%k != 0 {
				stores++
			}
			if stores > n {
				return false
			}
		}
		return true
	}

	start, end := 1, max(quantities)

	var res int
	for start <= end {
		k := start + (end-start)/2

		if canDistribute(k) {
			res = k
			end = k - 1
		} else {
			start = k + 1
		}
	}

	return res
}

func max(arr []int) (res int) {
	res = arr[0]
	for _, v := range arr {
		if v >= res {
			res = v
		}
	}

	return res
}
