package main

func plusOne(digits []int) []int {
	var (
		newDigits = make([]int, len(digits))
		wasAdd    = false
	)

	copy(newDigits, digits)

	for i := len(newDigits) - 1; i >= 0; i-- {
		if newDigits[i]+1 == 10 {
			newDigits[i] = 0
			continue
		} else {
			newDigits[i] += 1
			wasAdd = true
			break
		}
	}

	if !wasAdd {
		newDigits = append([]int{1}, newDigits...)
	}

	return newDigits
}
