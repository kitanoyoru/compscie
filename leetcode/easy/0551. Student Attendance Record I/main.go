package main

func checkRecord(s string) bool {
	var (
		absentCount          = 0
		consecutiveLateCount = 0
	)

	for _, v := range s {
		switch v {
		case 'A':
			absentCount++
			if absentCount >= 2 {
				return false
			}
		case 'L':
			consecutiveLateCount++
			if consecutiveLateCount >= 3 {
				return false
			}
			continue
		}

		consecutiveLateCount = 0
	}

	return true
}
