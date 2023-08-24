// Solved by @kitanoyoru

package main

type Rode struct {
	R bool
	G bool
	B bool
}

func (r *Rode) IsAllBool() bool {
	return r.R && r.G && r.B
}

func countPoints(rings string) int {
	rods := make([]Rode, 0, 10)
	for i := 0; i < 10; i++ {
		rods = append(rods, Rode{})
	}

	for i := 0; i < len(rings); i += 2 {
		color := rings[i]
		rod := rings[i+1] - '0'

		switch color {
		case 'R':
			rods[rod].R = true
		case 'G':
			rods[rod].G = true
		case 'B':
			rods[rod].B = true
		}

	}

	ans := 0
	for _, rod := range rods {
		if rod.IsAllBool() {
			ans++
		}
	}

	return ans
}
