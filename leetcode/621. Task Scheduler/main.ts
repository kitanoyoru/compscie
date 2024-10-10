function leastInterval(tasks: string[], n: number): number {
  let freq = new Array(26).fill(0)
  for (const t of tasks) {
    freq[t.charCodeAt(0) - 65]++
  }
  freq.sort((a, b) => a - b)

  const chunk = freq[25] - 1
  let idle = chunk * n

  for (let i = 24; i >= 0; i--) {
    idle -= Math.min(chunk, freq[i])
  }

  if (idle < 0) {
    return tasks.length
  }

  return tasks.length + idle
}
