package main

func twoOutOfThree(nums1 []int, nums2 []int, nums3 []int) []int {
	m := make(map[int]int, len(nums1)+len(nums2)+len(nums3))

	for _, s := range [][]int{nums1, nums2, nums3} {
		visited := make(map[int]struct{}, len(s))
		for _, v := range s {
			if _, ok := visited[v]; !ok {
				m[v]++
				visited[v] = struct{}{}
			}
		}
	}

	result := make([]int, 0, len(m))
	for v, f := range m {
		if f >= 2 {
			result = append(result, v)
		}
	}

	return result
}

