// Solved by @kitanoyoru
// https://leetcode.com/problems/group-anagrams/

const groupAnagrams = (strs: string[]): string[][] => {
  let m = new Map<string, string[]>()

  for (const s of strs) {
    let sarr = Array.from(s)
    sarr.sort((a, b) => a.localeCompare(b))
    let temp = sarr.reduce((p, c) => p + c, "")
    if (m.has(temp)) {
      m.set(temp, [...m.get(temp)!, s])
    } else {
      m.set(temp, [s])
    }
  }

  return [...m.values()]
}
