package main

func minimumIndex(nums []int) int {
	x, totalFreq := getDominant(nums)

	leftFreq := 0
	for i := 0; i < len(nums); i++ {
		if nums[i] == x {
			leftFreq++
		}

		rightFreq := totalFreq - leftFreq

		leftLength := i + 1
		rightLength := len(nums) - leftLength

		if leftFreq*2 > leftLength && rightFreq*2 > rightLength {
			return i
		}
	}

	return -1
}

func getDominant(arr []int) (int, int) {
	if len(arr) == 0 {
		return 0, 0
	}

	freq := make(map[int]int, len(arr))
	for _, v := range arr {
		freq[v]++
	}

	for k, v := range freq {
		if v*2 > len(arr) {
			return k, v
		}
	}

	return 0, 0

}
