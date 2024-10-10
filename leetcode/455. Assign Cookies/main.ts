const findContentChildren = (g: number[], s: number[]): number => {
  if (s.length == 0) return 0

  const sortable = (a: number, b: number) => a - b

  g.sort(sortable)
  s.sort(sortable)

  let maxNum = 0

  let cookieIdx = s.length - 1
  let childIdx = g.length - 1

  while (cookieIdx >= 0 && childIdx >= 0) {
    if (s[cookieIdx] >= g[childIdx]) {
      maxNum++

      cookieIdx--
      childIdx--
    } else {
      childIdx--
    }
  }

  return maxNum
}
