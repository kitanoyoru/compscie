// 14.Longest Common Prefix solved by @kitanoyoru
// https://leetcode.com/problems/longest-common-prefix/

const longestCommonPrefix = (strs: string[]): string => {
  let prefix: string = strs[0]
  for (let i = 1; i < strs.length; ++i) {
    for (let j = 0, k = 0; prefix[j] || strs[i][k]; ++j, ++k) {
      if (prefix[j] != strs[i][k]) {
        prefix = prefix.slice(0, j)
      }
    }
  }
  return prefix
}
