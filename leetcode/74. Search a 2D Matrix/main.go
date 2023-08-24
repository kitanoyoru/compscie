// Solved by @kitanoyoru
// https://leetcode.com/problems/search-a-2d-matrix/

func searchMatrix(matrix [][]int, target int) bool {
	rowLen := len(matrix[0])

	start, mid, end := 0, 0, rowLen-1

	for _, row := range matrix {
		if row[0] > target || row[rowLen-1] < target {
			continue
		} else {
			for start <= end {
				mid = start + (end-start)/2
				if row[mid] == target {
					return true
				} else if row[mid] > target {
					end = mid - 1
				} else {
					start = mid + 1
				}
			}
		}
	}

	return false
}
