from collections import defaultdict

from typing import List, Dict, Set


class Solution:
    def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        graph: Dict[int, List[int]] = defaultdict(list)
        for edge in edges:
            u, v = edge[0], edge[1]
            graph[u].append(v)
            graph[v].append(u)

        return self.dfs(graph, source, destination, set())

    def dfs(self, graph: Dict[int, List[int]], current: int, target: int, visited: Set[int]) -> bool:
        if current == target:
            return True

        if current in visited:
            return False
        else:
            visited.add(current)

        for next in graph[current]:
            if self.dfs(graph, next, target, visited):
                return True

        return False
