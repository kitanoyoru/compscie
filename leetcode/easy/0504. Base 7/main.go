package main

func convertToBase7(num int) string {
	if num == 0 {
		return "0"
	}

	neg := num < 0
	if neg {
		num = -num
	}

	buf := []byte{}

	for num > 0 {
		buf = append(buf, byte('0'+num%7))
		num /= 7
	}

	if neg {
		buf = append(buf, '-')
	}

	for i, j := 0, len(buf)-1; i < j; i, j = i+1, j-1 {
		buf[i], buf[j] = buf[j], buf[i]
	}

	return string(buf)
}
