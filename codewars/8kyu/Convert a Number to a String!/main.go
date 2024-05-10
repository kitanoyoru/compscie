package kata

import (
	"bytes"
	"math"
)

func NumberToString(n int) string {
	if n == 0 {
		return "0"
	}

	isNegative := n < 0
	if isNegative {
		n = -n
	}

	var buffer bytes.Buffer
	for n > 0 {
		digit := n % 10
		buffer.WriteByte(byte(digit) + '0')
		n = int(math.Floor(float64(n) / 10.0))
	}

	if isNegative {
		buffer.WriteByte('-')
	}

	inner := buffer.Bytes()

	for i, j := 0, len(inner)-1; i < j; i, j = i+1, j-1 {
		inner[i], inner[j] = inner[j], inner[i]
	}

	return string(inner)
}
