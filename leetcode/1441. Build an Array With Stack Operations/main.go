package main

const (
	PUSH = "Push"
	POP  = "Pop"
)

func buildArray(target []int, n int) []string {
	result := []string{}

	curr := 1
	idx := 0

	for curr <= n && idx < len(target) {
		num := target[idx]
		if num == curr {
			result = append(result, PUSH)
			curr++
			idx++
		} else {
			result = append(result, PUSH)
			result = append(result, POP)
			curr++
		}

	}

	return result
}
