package kata

import "strconv"

func ValidISBN10(isbn string) bool {
	if len(isbn) != 10 {
		return false
	}

	sum := 0
	for i, c := range isbn {
		v, err := strconv.Atoi(string(c))
		if err != nil {
			if (c == 'X' || c == 'x') && i == len(isbn)-1 {
				v = 10
			} else {
				return false
			}
		}

		sum += (i + 1) * v
	}

	if sum%11 == 0 {
		return true
	}

	return false
}
