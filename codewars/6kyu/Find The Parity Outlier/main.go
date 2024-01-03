package kata

type CountPair struct {
	counter   int
	lastValue int
}

func (c *CountPair) Set(val int) {
	c.lastValue = val
	c.counter++
}

func FindOutlier(integers []int) int {
	even, odd := new(CountPair), new(CountPair)
	for _, val := range integers {
		if val%2 == 0 {
			even.Set(val)
		} else {
			odd.Set(val)
		}
	}

	if even.counter > odd.counter {
		return odd.lastValue
	}

	return even.lastValue
}
