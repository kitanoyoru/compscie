package main

func arraySign(nums []int) int {
	flag := 1
	for _, num := range nums {
		if num == 0 {
			return 0
		}
		if num < 0 {
			flag *= -1
		}
	}

	return flag
}
