package main

func reverseStr(s string, k int) string {
	b := []byte(s)

	for i := 0; i < len(b); i += 2 * k {
		reverse(b, i, min(i+k, len(b))-1)
	}

	return string(b)
}

func reverse(b []byte, start, end int) {
	for i, j := start, end; i < j; i, j = i+1, j-1 {
		b[i], b[j] = b[j], b[i]
	}
}
