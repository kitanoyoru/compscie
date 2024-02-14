package kata

import (
	"fmt"
	"strconv"
	"strings"
)

func Solution(list []int) string {
	var result []string

	start, end := list[0], list[0]

	for i := 1; i < len(list); i++ {
		if list[i] == end+1 {
			end = list[i]
		} else {
			result = appendRange(result, start, end)

			start, end = list[i], list[i]
		}
	}

	result = appendRange(result, start, end)

	return strings.Join(result, ",")
}

func appendRange(result []string, start, end int) []string {
	if start == end {
		result = append(result, strconv.Itoa(start))
	} else if start+1 == end {
		result = append(result, strconv.Itoa(start), strconv.Itoa(end))
	} else {
		result = append(result, fmt.Sprintf("%v-%v", start, end))
	}

	return result
}
