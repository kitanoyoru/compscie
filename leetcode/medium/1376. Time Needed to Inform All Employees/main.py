import queue


class Solution:
    def numOfMinutes(
        self, n: int, headID: int, manager: List[int], informTime: List[int]
    ) -> int:
        ans = 0
        graph = [[] for _ in range(n)]
        for i in range(n):
            if manager[i] != -1:
                graph[manager[i]].append(i)

        q = queue.Queue()
        q.put((headID, informTime[headID]))

        while not q.empty():
            empl, time = q.get()
            ans = max(ans, time)

            for node in graph[empl]:
                q.put((node, time + informTime[node]))

        return ans
