function detectCapitalUse(word: string): boolean {
  return (
    word == word.toUpperCase() ||
    word == word.toLowerCase() ||
    word ==
      word.substring(0, 1).toUpperCase() +
        word.substring(1, word.length).toLowerCase()
  )
}
