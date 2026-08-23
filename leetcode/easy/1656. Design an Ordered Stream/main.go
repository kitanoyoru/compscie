// Solved by @kitanoyoru

package main

type OrderedStream struct {
	hm     map[int]string
	n      int
	posPtr int
}

func Constructor(n int) OrderedStream {
	return OrderedStream{
		hm:     make(map[int]string),
		n:      n,
		posPtr: 1,
	}
}

func (this *OrderedStream) Insert(idKey int, value string) []string {
	this.hm[idKey] = value

	ans := []string{}
	for this.posPtr <= this.n && this.hm[this.posPtr] != "" {
		ans = append(ans, this.hm[this.posPtr])
		this.posPtr++
	}

	return ans
}

/**
 * Your OrderedStream object will be instantiated and called as such:
 * obj := Constructor(n);
 * param_1 := obj.Insert(idKey,value);
 */
