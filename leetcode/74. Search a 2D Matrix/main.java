// Solved by @kitanoyoru
// https://leetcode.com/problems/search-a-2d-matrix/

class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rowLen = matrix[0].length;
        int start = 0, mid, end = rowLen - 1, i;

        for (i = 0; i < matrix.length; i++) {
            if (target < matrix[i][0] || target > matrix[i][rowLen - 1]) {
                continue;
            } else {
                while (start <= end) {
                    mid = start + (end - start) / 2;
                    if (matrix[i][mid] == target) {
                        return true;
                    }
                    if (target > matrix[i][mid]) {
                        start = mid + 1;
                    } else {
                        end = mid - 1;
                    }
                }
            }
        }

        return false;
    }
}
