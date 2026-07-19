class Solution:
    def smallestSubsequence(self, s: str) -> str:
        last_occurence = {ch: i for i, ch in enumerate(s)}

        seen = set()
        stack = list()

        for idx, ch in enumerate(s):
            if ch in seen:
                continue

            while stack and ch < stack[-1] and last_occurence[stack[-1]] > idx:
                removed_ch = stack.pop()
                seen.remove(removed_ch)

            stack.append(ch)
            seen.add(ch)

        return "".join(stack)
