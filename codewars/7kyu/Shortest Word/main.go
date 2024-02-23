package kata

import (
	"strings"
)

// https://cs.opensource.google/go/go/+/refs/tags/go1.22.0:src/slices/sort.go;l=77
func MinFunc[S ~[]E, E any](x S, cmp func(a, b E) int) E {
	if len(x) < 1 {
		panic("slices.MinFunc: empty list")
	}
	m := x[0]
	for i := 1; i < len(x); i++ {
		if cmp(x[i], m) < 0 {
			m = x[i]
		}
	}
	return m
}

func FindShort(s string) int {
	return len(MinFunc(strings.Fields(s), func(a, b string) int {
		return len(a) - len(b)
	}))
}
