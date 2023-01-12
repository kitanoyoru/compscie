package main

type Trie struct {
	child [2]*Trie
}

func NewTrie() *Trie {
	return &Trie{}
}

func (t *Trie) IncreaseBy(num int) {
	cur := t

	for i := 31; i >= 0; i-- {
		bit := (num >> i) & 1
		if cur.child[bit] == nil {
			cur.child[bit] = NewTrie()
		}
		cur = cur.child[bit]
	}
}

func (t *Trie) FindMax(num int) int {
	cur := t
	ans := 0

	for i := 31; i >= 0; i-- {
		bit := (num >> i) & 1
		if cur.child[1-bit] != nil {
			cur = cur.child[1-bit]
			ans |= 1 << i
		} else {
			cur = cur.child[bit]
		}
	}

	return ans
}

func max(a, b int) int {
	if a > b {
		return a
	}

	return b
}

func findMaximumXOR(nums []int) int {
	t := NewTrie()

	for _, num := range nums {
		t.IncreaseBy(num)
	}

	ans := 0

	for _, num := range nums {
		ans = max(ans, t.FindMax(num))
	}

	return ans
}
