package main

func convertToTitle(columnNumber int) string {
	buf := []byte{}

	for columnNumber > 0 {
		columnNumber -= 1
		buf = append(buf, byte(columnNumber%26+'A'))
		columnNumber /= 26
	}

	for l, r := 0, len(buf)-1; l < r; l, r = l+1, r-1 {
		buf[l], buf[r] = buf[r], buf[l]
	}

	return string(buf)
}
