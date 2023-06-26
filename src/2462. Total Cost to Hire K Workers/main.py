from queue import PriorityQueue
from typing import Tuple, List

class Solution:
    def totalCost(self, costs: List[int], k: int, candidates: int) -> int:
        pq: PriorityQueue[Tuple[int, bool]] = PriorityQueue()

        left, right = 0, len(costs)-1

        for _ in range(candidates):
            if len(costs) < candidates:
                pq.put((costs[left], True))
                del costs[left]
                left += 1

            if len(costs) < candidates:
                pq.put((costs[right], False))
                del costs[right]
                right -= 1

        ans = 0

        for i in range(k):
            val, is_front = pq.get()
            ans += val

            if is_front:
                opt = costs[left]
                left += 1
            else:
                opt = costs[right]
                right -= 1

            pq.put((opt, is_front))

        return ans

