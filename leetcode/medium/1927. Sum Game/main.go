package main

func sumGame(num string) bool {
	var (
		sumDiff int
		qDiff   int
	)

	for i, v := range num {
		if i < len(num)/2 {
			if v == '?' {
				qDiff++
			} else {
				sumDiff += int(v) - 48
			}
		} else {
			if v == '?' {
				qDiff--
			} else {
				sumDiff -= int(v) - 48
			}
		}
	}

	return (sumDiff*2 + qDiff*9) != 0
}
