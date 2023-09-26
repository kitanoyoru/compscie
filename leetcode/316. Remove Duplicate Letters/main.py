from typing import Set


class Solution:
    def removeDuplicateLetters(self, s: str) -> str:
        stack: list[str] = []

        seen: Set[str] = set()
        last_occ = {v: k for k, v in enumerate(s)}

        for i, c in enumerate(s):
            if c in seen:
                continue

            while stack and c < stack[-1] and i < last_occ[stack[-1]]:
                seen.remove(stack.pop())

            seen.add(c)
            stack.append(c)

        return "".join(stack)
