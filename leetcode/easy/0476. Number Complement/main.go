package main

import "strconv"

func findComplement(num int) int {
	buf := []byte(strconv.FormatInt(int64(num), 2))

	for i, v := range buf {
		switch v {
		case '1':
			buf[i] = '0'
		case '0':
			buf[i] = '1'
		}
	}

	res, _ := strconv.ParseInt(string(buf), 2, 64)

	return int(res)
}
