class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        m = dict()
        for s in strs:
            sorted_s = "".join(sorted(s))
            field = m.setdefault(sorted_s, [])
            if field is not None:
                m[sorted_s].append(s)

        return m.values()
