// Solved by @kitanoyoru

package main

func numJewelsInStones(jewels string, stones string) int {
	hm := make(map[rune]int)
	for _, stone := range stones {
		hm[stone]++
	}

	ans := 0
	for _, jewel := range jewels {
		ans += hm[jewel]
	}

	return ans
}
