package main

func prefixesDivBy5(nums []int) []bool {
	var (
		result = make([]bool, len(nums))
		num    = 0
	)

	for i, bit := range nums {
		num = (num*2 + bit) % 5
		result[i] = num == 0
	}

	return result
}
