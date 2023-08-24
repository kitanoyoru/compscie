package main

import "fmt"

func main() {
	var n int
	fmt.Scanln(&n)

	for i := 0; i < n; i++ {
		var s string
		fmt.Scanln(&s)

		if len(s) > 10 {
			s = fmt.Sprintf("%c%v%c", s[0], len(s)-2, s[len(s)-1])
		}

		fmt.Println(s)
	}
}
