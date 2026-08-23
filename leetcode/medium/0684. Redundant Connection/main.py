# Solved by @kitanoyoru

from collections import defaultdict
from typing import DefaultDict, List


class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        self.connected: DefaultDict[int, List[int]] = defaultdict(list)
        for edge in edges:
            self.visited = defaultdict(bool)
            x, y = edge[0], edge[1]
            if self.is_connected(edge[0], edge[1]):
                return edge
            self.connected[x].append(y)
            self.connected[y].append(x)

        return []

    def is_connected(self, x: int, y: int) -> bool:
        if x == y:
            return True
        for adj in self.connected[x]:
            if not self.visited[adj]:
                self.visited[adj] = True
                if self.is_connected(adj, y):
                    return True

        return False
