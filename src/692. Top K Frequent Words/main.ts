// Solved by @kitanoyoru
// https://leetcode.com/problems/top-k-frequent-words/

const topKFrequent = (words: string[], k: number): string[] => {
  const m = new Map<string, number>()
  const uniq: string[] = []

  for (const word of words) {
    if (!m.has(word)) {
      uniq.push(word)
      m.set(word, 1)
    }
    m.set(word, m.get(word)! + 1)
  }

  uniq.sort((a, b) => {
    if (m.get(a) == m.get(b)) {
      return a.localeCompare(b)
    }
    return m.get(b)! - m.get(a)!
  })

  return uniq.slice(0, k)
}
