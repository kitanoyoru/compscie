function dayOfYear(date: string): number {
  const t = new Date(date)
  return Math.floor(
    (t.getTime() - Date.UTC(t.getUTCFullYear(), 0, 0)) / 86400000
  )
}
