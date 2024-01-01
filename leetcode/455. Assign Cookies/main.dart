class Solution {
    int findContentChildren(List<int> g, List<int> s) {
        if (s.length == 0) return 0;

        g.sort();
        s.sort();

        var maxNum = 0;

        var cookieIdx = s.length - 1;
        var childIdx = g.length - 1;

        while (cookieIdx >= 0 && childIdx >= 0) {
            if (s[cookieIdx] >= g[childIdx]) {
                maxNum++;

                cookieIdx--;
                childIdx--;
            } else {
                childIdx--;
            }
        }

        return maxNum;
    }
}
