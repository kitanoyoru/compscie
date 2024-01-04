package kata

import "fmt"

func PrinterError(s string) string {
	errors := 0
	for i := 0; i < len(s); i++ {
		if !(s[i] >= 'a' && s[i] <= 'm') {
			errors++
		}
	}

	return fmt.Sprintf("%v/%v", errors, len(s))
}
