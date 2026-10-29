class Solution:
    def minimumAbsDifference(self, arr: list[int]) -> list[list[int]]:
        arr.sort()

        result = []
        min_diff = float("inf")

        for a, b in zip(arr, arr[1:]):
            d = b - a
            if d < min_diff:
                min_diff = d
                result = [[a, b]]
            elif d == min_diff:
                result.append([a, b])

        return result
