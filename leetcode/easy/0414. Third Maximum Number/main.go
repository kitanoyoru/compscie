package main

func thirdMax(nums []int) int {
	var top [3]int

	n := 0

	for _, num := range nums {
		i := 0

		for i < n && top[i] > num {
			i++
		}

		if i < n && top[i] == num {
			continue
		}

		if i == len(top) {
			continue
		}

		copy(top[i+1:], top[i:min(n, len(top)-1)])
		top[i] = num

		if n < len(top) {
			n++
		}
	}

	if n < len(top) {
		return top[0]
	}

	return top[len(top)-1]
}
