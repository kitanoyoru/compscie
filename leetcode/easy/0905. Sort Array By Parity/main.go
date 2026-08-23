package main

func sortArrayByParity(nums []int) []int {
	even, odd := []int{}, []int{}

	for _, v := range nums {
		if v&1 == 0 {
			even = append(even, v)
		} else {
			odd = append(odd, v)
		}
	}

	even = append(even, odd...)

	return even
}
