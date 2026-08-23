// Solved by @kitanoyoru

package main

func intersection(nums1 []int, nums2 []int) []int {
	hm1, hm2 := make(map[int]bool), make(map[int]bool)

	for _, num := range nums1 {
		hm1[num] = true
	}
	for _, num := range nums2 {
		hm2[num] = true
	}

	ans := []int{}
	for k, _ := range hm1 {
		if v, _ := hm2[k]; v == true {
			ans = append(ans, k)
		}
	}

	return ans
}
