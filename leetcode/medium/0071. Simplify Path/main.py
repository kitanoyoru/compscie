class Solution:
    def simplifyPath(self, path: str) -> str:
        parts = path.split("/")
        stack = []

        for part in parts:
            if len(stack) > 0 and part == "..":
                stack.pop()
            elif part != "" and part != "." and part != "..":
                stack.append(part)

        res = "/" + "/".join(stack)

        return res
