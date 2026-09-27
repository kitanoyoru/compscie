package main

func reverseParentheses(s string) string {
	var stack [][]byte

	current := []byte{}

	for i := 0; i < len(s); i++ {
		switch s[i] {
		case '(':
			stack = append(stack, current)
			current = []byte{}
		case ')':
			for l, r := 0, len(current) - 1; l < r; l, r = l+1, r-1 {
				current[l], current[r] = current[r], current[l]
			}
			prev := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			current = append(prev, current...)
		default:
			current = append(current, s[i])
		}
	}

	return string(current)
}
