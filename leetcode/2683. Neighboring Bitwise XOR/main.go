package main

/*

XOR

0 0 0
0 1 1
1 0 1
1 1 0

*/

func doesValidArrayExist(derived []int) bool {
	original := make([]int, len(derived)+1)

	original[0] = 0

	for i := 0; i < len(derived); i++ {
		original[i+1] = derived[i] ^ original[i]
	}

	checkForZero := (original[0] == original[len(original)-1])

	original[0] = 1

	for i := 0; i < len(derived); i++ {
		original[i+1] = derived[i] ^ original[i]
	}

	checkForOne := (original[0] == original[len(original)-1])

	return checkForZero || checkForOne
}
