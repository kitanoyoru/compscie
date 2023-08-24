package main

import (
	"bufio"
	"fmt"
	"os"
)

const (
	TrueAnswer  = "YES"
	FalseAnswer = "NO"
)

func main() {
	var w int
	in := bufio.NewReader(os.Stdin)
	fmt.Fscan(in, &w)

	if w == 2 || w%2 == 1 {
		fmt.Println(FalseAnswer)
		return
	}

	fmt.Println(TrueAnswer)

}
