function checkRecord(s: string): boolean {
  let [absentCount, consecutiveLateCount] = [0, 0]

  for (let v of s.split("")) {
    switch (v) {
      case "A":
        absentCount++
        if (absentCount >= 2) {
          return false
        }

        break
      case "L":
        consecutiveLateCount++
        if (consecutiveLateCount >= 3) {
          return false
        }

        continue
    }

    consecutiveLateCount = 0
  }

  return true
}
