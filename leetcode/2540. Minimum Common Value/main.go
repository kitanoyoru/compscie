package main

import "math"

func binarySearch(target int, arr []int) int {
	low, high := 0, len(arr) - 1

	for low <= high {
		mid := (low + high) / 2
		if arr[mid] == target {
			return mid
		} else if arr[mid] < target {
			low = mid + 1
		} else {
			high = mid - 1
		}
	}

	return -1
}

func getCommon(nums1 []int, nums2 []int) int {
	res := math.MaxInt

	for _, target := range nums1 {
		idx := binarySearch(target, nums2)
		if idx != -1 && target < res {
			res = target
		}
	}

	if res == math.MaxInt {
		return -1
	}

	return res
}
