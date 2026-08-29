class Solution:
    def sumGame(self, num: str) -> bool:
        half = len(num) // 2

        sum_diff, q_diff = 0, 0

        for i, v in enumerate(num):
            if i < half:
                if v == '?':
                    q_diff += 1
                else:
                    sum_diff += int(v)
            else:
                if v == '?':
                    q_diff -= 1
                else:
                    sum_diff -= int(v)

        return (sum_diff * 2 + q_diff * 9) != 0
