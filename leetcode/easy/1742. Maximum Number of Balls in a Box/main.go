// Solved by @kitanoyoru

package main

func getSumOfDigits(num int) int {
	ans := 0

	for num != 0 {
		ans += num % 10
		num /= 10
	}

	return ans
}

func getMaxInMap(hm *map[int]int) int {
	val := -1 << 31
	for _, v := range *hm {
		if val < v {
			val = v
		}
	}

	return val
}

func countBalls(lowLimit int, highLimit int) int {
	hm := make(map[int]int)

	for num := lowLimit; num < highLimit+1; num++ {
		k := getSumOfDigits(num)
		hm[k]++
	}

	ans := getMaxInMap(&hm)

	return ans
}
