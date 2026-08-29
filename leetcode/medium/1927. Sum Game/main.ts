function sumGame(num: string): boolean {
  const half = Math.round(num.length / 2)

  let [sumDiff, qDiff] = [0, 0]

  ;[...num].forEach((c, i) => {
    if (i < half) {
      if (c == "?") {
        qDiff++
      } else {
        sumDiff += c.charCodeAt(0) - 48
      }
    } else {
      if (c == "?") {
        qDiff--
      } else {
        sumDiff -= c.charCodeAt(0) - 48
      }
    }
  })

  return sumDiff * 2 + qDiff * 9 != 0
}
