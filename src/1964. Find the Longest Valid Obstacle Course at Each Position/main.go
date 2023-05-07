package main

func initDefaultIntSlice(size int) []int {
	s := []int{}
	for i := 0; i < size; i++ {
		s = append(s, 0)
	}

	return s
}

func longestObstacleCourseAtEachPosition(obstacles []int) []int {
	n := len(obstacles)

	ans, subseq := initDefaultIntSlice(n), initDefaultIntSlice(n)

	subseq_length := 0

	binarySearch := func(obstacle int) int {
		left, right := 0, subseq_length
		for left < right {
			mid := left + (right-left)/2
			if subseq[mid] <= obstacle {
				left = mid + 1
			} else {
				right = mid
			}
		}

		return left
	}

	for i, obstacle := range obstacles {
		idx := binarySearch(obstacle)
		ans[i] = idx + 1
		if subseq_length == idx {
			subseq_length++
		}
		subseq[idx] = obstacle
	}

	return ans
}
