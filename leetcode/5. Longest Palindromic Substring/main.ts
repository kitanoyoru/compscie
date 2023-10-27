const longestPalindrome = (s: string): string => {
    let T = "^#" + s.split("").join("#") + "#$";
    let n = T.length;

    let P = new Array(n).fill(0);
    let C = 0, R = 0;

    for (let i = 1; i < n - 1; i++) {
        P[i] = (R > i) ? Math.min(R - i, P[2 * C - i]) : 0;
        while (T[i + 1 + P[i]] == T[i - 1 - P[i]])
            P[i]++;

        if (i + P[i] > R) {
            C = i;
            R = i + P[i];
        }
    }

    let maxLen = Math.max(...P);
    let centerIndex = P.indexOf(maxLen);

    return s.substring((centerIndex - maxLen) / 2, (centerIndex + maxLen) / 2);
};
