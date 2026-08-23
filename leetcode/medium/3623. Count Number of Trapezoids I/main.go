package main

func countTrapezoids(points [][]int) int {
	var (
		Mod  int64 = 1000000007
		Inv2 int64 = (Mod + 1) / 2
	)

	frequency := make(map[int]int, len(points))
	for _, point := range points {
		frequency[point[1]]++
	}

	var sumF, sumF2 int64

	for _, c := range frequency {
		if c >= 2 {
			cc := int64(c)
			f := (cc * (cc - 1) / 2) % Mod
			sumF = (sumF + f) % Mod
			sumF2 = (sumF2 + (f*f)%Mod) % Mod
		}
	}

	answer := (sumF * sumF) % Mod
	answer = (answer - sumF2 + Mod) % Mod
	answer = (answer * Inv2) % Mod

	return int(answer)
}
