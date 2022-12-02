// Solved by @kitanoyoru

package main

func arithmeticTriplets(nums []int, diff int) int {
	ans := 0
	hm := make(map[int]int)

	for _, num := range nums {
		hm[num]++
	}

	for _, num := range nums {
		if hm[num+diff] != 0 && hm[num+diff+diff] != 0 {
			ans++
		}
	}

	return ans
}
