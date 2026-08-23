package main

import "strings"

func simplifyPath(path string) string {
	parts := strings.Split(path, "/")
	stack := []string{}

	for _, part := range parts {
		if len(stack) > 0 && part == ".." {
			stack = stack[:len(stack)-1]
		} else if part != "" && part != "." && part != ".." {
			stack = append(stack, part)
		}
	}

	res := "/" + strings.Join(stack, "/")

	return res
}
