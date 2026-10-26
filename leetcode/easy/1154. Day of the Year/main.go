package main

import "time"

func dayOfYear(date string) int {
	t, _ := time.Parse(time.DateOnly, date)
	return t.YearDay()
}
