package main

import (
	"sort"
	"strconv"
	"strings"
)

func isDigit(b byte) bool {
	return b >= '0' && b <= '9'
}

func isLower(b byte) bool {
	return b >= 'a' && b <= 'z'
}

func countOfAtoms(formula string) string {
	stack := []map[string]int{}
	stack = append(stack, make(map[string]int))

	n := len(formula)

	for i := 0; i < n; {
		if formula[i] == '(' {
			stack = append(stack, make(map[string]int))
			i++
		} else if formula[i] == ')' {
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]

			i++
			start := i

			for i < n && isDigit(formula[i]) {
				i++
			}

			multiplier := 1
			if start < i {
				multiplier, _ = strconv.Atoi(formula[start:i])
			}

			for el, count := range top {
				stack[len(stack)-1][el] = stack[len(stack)-1][el] + count*multiplier
			}
		} else {
			start := i
			i++

			for i < n && isLower(formula[i]) {
				i++
			}

			element := formula[start:i]
			start = i

			for i < n && isDigit(formula[i]) {
				i++
			}

			count := 1
			if start < i {
				count, _ = strconv.Atoi(formula[start:i])
			}

			stack[len(stack)-1][element] = stack[len(stack)-1][element] + count
		}
	}

	result := stack[len(stack)-1]

	keys := make([]string, 0, len(result))
	for key := range result {
		keys = append(keys, key)
	}

	sort.Strings(keys)

	var sb strings.Builder
	for _, el := range keys {
		sb.WriteString(el)
		if count := result[el]; count > 1 {
			sb.WriteString(strconv.Itoa(count))
		}
	}

	return sb.String()
}

