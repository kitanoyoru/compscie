package main

func minLength(s string) int {
	stack := make([]rune, 0, len(s))

	for _, c := range s {
		stack = append(stack, c)

		if len(stack) >= 2 {
			if (stack[len(stack)-2] == 'A' && stack[len(stack)-1] == 'B') || (stack[len(stack)-2] == 'C' && stack[len(stack)-1] == 'D') {
				stack = stack[:len(stack)-2]
			}
		}
	}

	return len(stack)
}
