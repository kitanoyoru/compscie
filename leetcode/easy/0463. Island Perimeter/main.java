class Solution {
    public int islandPerimeter(int[][] grid) {
        int lands = 0, neigh = 0;

        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == 1) {
                    lands++;
                    if (i < grid.length - 1 && grid[i+1][j] == 1) {
                        neigh++;
                    }
                    if (j < grid[i].length - 1 && grid[i][j+1] == 1) {
                        neigh++;
                    }
                }
            }
        }    
        
        return 4 * lands - 2 * neigh;
    }
}