import heapq

from functools import partial

from typing import List


class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = nums[:k]
        heapq.heapify(heap)

        push = partial(heapq.heappush, heap)
        pop = partial(heapq.heappop, heap)

        for num in nums[k:]:
            if num > heap[0]:
                pop()
                push(num)

        return heap[0]
