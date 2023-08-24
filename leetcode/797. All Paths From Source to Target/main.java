// Solved by @kitanoyoru
// https://leetcode.com/problems/all-paths-from-source-to-target/

import java.util.*;

class Solution {
  private void dfs(int v, List<Integer> path, int[][] graph, List<List<Integer>> ans) {
    path.add(v);
    if (v == graph.length - 1) {
      ans.add(new ArrayList<>(path));
    }
    else {
      for (int u : graph[v]) {
        dfs(u, path, graph, ans);
      }
    }
    path.remove(path.size() - 1);
  }

  public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
    List<List<Integer>> ans = new ArrayList<>();
    dfs(0, new ArrayList<>(), graph, ans);

    return ans;
  }
}

