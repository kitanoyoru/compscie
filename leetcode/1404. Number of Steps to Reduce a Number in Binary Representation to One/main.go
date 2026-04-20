package main

func numSteps(s string) int {
	var steps, carry int
	for i := len(s) - 1; i > 0; i-- {
		bit := int(s[i]) & 1
		steps += 1 + (bit ^ carry)
		carry |= bit
	}

	return steps + carry
}

