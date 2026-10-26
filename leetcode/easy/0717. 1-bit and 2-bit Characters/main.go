package main

func isOneBitCharacter(bits []int) bool {
	var (
		n   = len(bits)
		idx = 0
	)

	for idx < n-1 {
		idx += bits[idx] + 1
	}

	return idx == n-1
}
