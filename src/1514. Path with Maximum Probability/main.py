import heapq

from typing import DefaultDict, Tuple, List


class Solution:
    def maxProbability(
        self,
        n: int,
        edges: List[List[int]],
        succProb: List[float],
        start: int,
        end: int,
    ) -> float:
        adj: DefaultDict[int, List[Tuple[int, float]]] = defaultdict(list)
        for edge, prob in zip(edges, succProb):
            adj[edge[0]].append((edge[1], prob))
            adj[edge[1]].append((edge[0], prob))

        probs: List[float] = [0.0] * n
        probs[start] = 1.0

        q: List[Tuple[int, float]] = []
        heapq.heappush(q, (start, 1.0))

        while q:
            i, p = heapq.heappop(q)

            if p < probs[i]:
                continue

            for j, prob in adj[i]:
                if p * prob > probs[j]:
                    heapq.heappush(q, (j, p * prob))
                    probs[j] = p * prob

        return probs[end]
