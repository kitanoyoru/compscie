package main

func findLHS(nums []int) int {
	freq := make(map[int]int, len(nums))
	for _, num := range nums {
		freq[num]++
	}

	result := 0

	for num, count := range freq {
		if nextCount, ok := freq[num+1]; ok {
			result = max(result, count+nextCount)
		}
	}

	return result
}
