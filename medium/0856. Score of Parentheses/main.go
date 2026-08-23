package main

import "errors"

type stack struct {
	values []int
}

func (s *stack) Push(val int) {
	s.values = append(s.values, val)
}

func (s *stack) Pop() (int, error) {
	if len(s.values) == 0 {
		return 0, errors.New("stack is empty")
	}
	idx := len(s.values) - 1
	val := s.values[idx]
	s.values = s.values[:idx]
	return val, nil
}

func scoreOfParentheses(s string) int {
	ss := new(stack)

	var score int
	for i := range s {
		if s[i] == '(' {
			ss.Push(score)
			score = 0
		} else {
			v, _ := ss.Pop()
			score = v + max(2*score, 1)
		}
	}

	return score
}
