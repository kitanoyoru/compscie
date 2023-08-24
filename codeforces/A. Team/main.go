package main

import (
	"fmt"
)

func packAddrs(n []int) []interface{} {
	p := make([]interface{}, len(n))
	for i := range n {
		p[i] = &n[i]
	}
	return p
}

func main() {
	var n int
	fmt.Scanln(&n)

	counter := 0

	for i := 0; i < n; i++ {
		args := make([]int, 3)
		fmt.Scanln(packAddrs(args)...)

		if args[0]+args[1]+args[2] >= 2 {
			counter++
		}
	}

	fmt.Println(counter)
}
