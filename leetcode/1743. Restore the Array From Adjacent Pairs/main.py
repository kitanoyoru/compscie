from collections import defaultdict
from typing import DefaultDict, List


class Solution:
    def restoreArray(self, adjacentPairs: List[List[int]]) -> List[int]:
        graph: DefaultDict[int, List[int]]= defaultdict(list)

        for u, v in adjacentPairs:
            graph[u].append(v)
            graph[v].append(u)

        result: List[int] = []

        for node, neigh in graph.items():
            if len(neigh) == 1:
                result = [node, neigh[0]]
                break

        while len(result) < len(adjacentPairs) + 1:
            last, prev = result[-1], result[-2]

            candidates = graph[last]
            new_neigh = candidates[0] if candidates[0] != prev else candidates[1]

            result.append(new_neigh)

        return result
