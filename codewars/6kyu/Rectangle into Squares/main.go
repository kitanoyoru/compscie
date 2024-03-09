package kata

func SquaresInRect(lng int, wdth int) []int {
	if lng == wdth {
		return nil
	}

	var res []int
	length, width := lng, wdth

	for length > 0 && width > 0 {
		if length > width {
			res = append(res, width)
			length -= width
		} else {
			res = append(res, length)
			width -= length
		}
	}

	return res
}
