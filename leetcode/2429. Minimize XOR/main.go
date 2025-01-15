package main

import "math/bits"

func minimizeXor(num1 int, num2 int) int {
	result := num1

	targetSetBitsCount := bits.OnesCount(uint(num2))
	setBitsCount := bits.OnesCount(uint(result))

	currentBit := 0

	for setBitsCount < targetSetBitsCount {
		if !isBitSet(result, currentBit) {
			result = setBit(result, currentBit)
			setBitsCount++
		}

		currentBit++
	}

	for setBitsCount > targetSetBitsCount {
		if isBitSet(result, currentBit) {
			result = unsetBit(result, currentBit)
			setBitsCount--
		}

		currentBit++
	}

	return result
}

func isBitSet(x, bit int) bool {
	return (x & (1 << bit)) != 0
}

func setBit(x, bit int) int {
	return (x | (1 << bit))
}

func unsetBit(x, bit int) int {
	return x & ^(1 << bit)
}
