// Solved by @kitanoyoru

package main

func convertTemperature(c float64) []float64 {
	f := (c * 9 / 5) + 32
	k := c + 273.15

	return []float64{k, f}
}
