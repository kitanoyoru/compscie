package main

func difference(hm1, hm2 *map[int]bool) []int {
	diff := []int{}

	for item1 := range *hm1 {
		if _, exists := (*hm2)[item1]; !exists {
			diff = append(diff, item1)
		}
	}

	return diff
}

func findDifference(nums1 []int, nums2 []int) [][]int {
	hm1, hm2 := make(map[int]bool), make(map[int]bool)
	for _, num := range nums1 {
		hm1[num] = true
	}
	for _, num := range nums2 {
		hm2[num] = true
	}

	return [][]int{
		difference(&hm1, &hm2),
		difference(&hm2, &hm1),
	}
}
