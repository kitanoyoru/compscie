package main

type FenwickTree struct {
	tree []int
}

func New(size int) *FenwickTree {
	return &FenwickTree{
		tree: make([]int, size+1),
	}
}

func (ft *FenwickTree) update(idx, delta int) {
	for idx < len(ft.tree) {
		ft.tree[idx] += delta
		idx += idx & -idx
	}
}

func (ft *FenwickTree) query(idx int) int {
	res := 0
	for idx > 0 {
		res += ft.tree[idx]
		idx -= idx & -idx
	}

	return res
}

func goodTriplets(nums1 []int, nums2 []int) int64 {
	n := len(nums1)
	pos2 := make([]int, n)
	for i, num := range nums2 {
		pos2[num] = i + 1
	}

	a := make([]int, n)
	for i, num := range nums1 {
		a[i] = pos2[num]
	}

	var (
		left  = make([]int, n)
		right = make([]int, n)
	)

	ft := New(n)
	for i := range n {
		left[i] = ft.query(a[i] - 1)
		ft.update(a[i], 1)
	}

	ft = New(n)
	for i := n - 1; i >= 0; i-- {
		right[i] = ft.query(n) - ft.query(a[i])
		ft.update(a[i], 1)
	}

	var res int64
	for i := range n {
		res += int64(left[i]) * int64(right[i])
	}

	return res
}
