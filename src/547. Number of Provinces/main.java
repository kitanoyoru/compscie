// Solved by @kitanoyoru
// https://leetcode.com/problems/number-of-provinces/

class Solution {
  public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    int counter = 0;
    boolean[] visited = new boolean[n];
    
    for (int i = 0; i < n; i++) {
      if (!visited[i]) {
        Queue<Integer> q = new LinkedList<>();
        q.add(i);
        counter++;

        while (!q.isEmpty()) {
          int temp = q.remove();
          visited[temp] = true;
          for (int j = 0; j < n; j++) 
            if (!visited[j] && isConnected[temp][j] == 1) 
              q.add(j);
        }
      }
    }

    return counter;
  }
}
