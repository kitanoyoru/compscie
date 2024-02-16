package kata

import "strconv"

func AmountOfPages(summary int) int {
	if summary <= 9 {
		return summary
	}

	n, digits := 0, 0

	for page := 1; page < summary; page++ {
		digits += len(strconv.Itoa(page))
		if digits == summary {
			n = page
			break
		}
		if digits > summary {
			n = page - 1
			break
		}

	}

	return n
}
