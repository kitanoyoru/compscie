package main

func dailyTemperatures(t []int) []int {
	stack := []int{}
	res := make([]int, len(t))

	for i := 0; i < len(t); i++ {
		for len(stack) != 0 && t[stack[len(stack)-1]] < t[i] {
			res[stack[len(stack)-1]] = i - stack[len(stack)-1]
			stack = stack[:len(stack)-1]
		}
		stack = append(stack, i)
	}

	return res
}
