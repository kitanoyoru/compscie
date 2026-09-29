function rotateString(s: string, goal: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (s.substring(i, s.length).concat(s.substring(0, i)) == goal) {
      return true
    }
  }

  return false
}
