package main

func decodeAtIndex(s string, k int) string {
	tapeLength, i := 0, 0

	for tapeLength < k {
		if s[i] >= '0' && s[i] <= '9' {
			tapeLength *= int(s[i] - '0')
		} else {
			tapeLength++
		}

		i++
	}

	for j := i - 1; j >= 0; j-- {
		if s[j] >= '0' && s[j] <= '9' {
			tapeLength /= int(s[j] - '0')
			k %= tapeLength
		} else {
			if k == 0 || k == tapeLength {
				return string(s[j])
			}

			tapeLength--
		}
	}

	return ""
}
