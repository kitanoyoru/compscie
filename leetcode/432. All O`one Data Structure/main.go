package main

type AllOne struct {
	table map[string]int
	st    []pair
}

type pair struct {
	count int
	key   string
}

func Constructor() AllOne {
}

func (this *AllOne) Inc(key string) {
}

func (this *AllOne) Dec(key string) {
}

func (this *AllOne) GetMaxKey() string {
}

func (this *AllOne) GetMinKey() string {
}
