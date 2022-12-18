package main

import "strconv"

type Stack []int

func NewStack() *Stack {
	return &Stack{}
}

func (s *Stack) Push(v int) {
	*s = append(*s, v)
}

func (s *Stack) Pop() int {
	res := (*s)[len(*s)-1]
	*s = (*s)[:len(*s)-1]

	return res
}

func (s *Stack) Peek() int {
	return (*s)[0]
}

func evalRPN(tokens []string) int {
	s := NewStack()
	for _, token := range tokens {
		if token == "+" {
			s.Push(s.Pop() + s.Pop())
		} else if token == "-" {
			temp := s.Pop()
			s.Push(s.Pop() - temp)
		} else if token == "*" {
			s.Push(s.Pop() * s.Pop())
		} else if token == "/" {
			temp := s.Pop()
			s.Push(s.Pop() / temp)
		} else {
			v, _ := strconv.Atoi(token)
			s.Push(v)
		}
	}

	return s.Peek()
}
