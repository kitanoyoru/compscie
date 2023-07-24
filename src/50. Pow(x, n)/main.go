func binExpand(x float64, n int) float64 {
	if n == 0 {
		return 1.0
	}

	if n < 0 {
		return 1 / binExpand(x, -n)
	}

	if n&1 == 1 {
		return x * binExpand(x*x, (n-1)/2)
	} else {
		return binExpand(x*x, n/2)
	}
}

func myPow(x float64, n int) float64 {
	return binExpand(x, n)

}
