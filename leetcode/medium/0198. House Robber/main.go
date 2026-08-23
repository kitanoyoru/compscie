// Solved by @kitanoyoru

package main

func rob(nums []int) int {
	if len(nums) == 0 {
		return 0
	}

	p1, p2 := 0, 0

	for _, num := range nums {
		temp := p1
		if p2+num > p1 {
			p1 = p2 + num
		}
		p2 = temp
	}

	return p1
}
