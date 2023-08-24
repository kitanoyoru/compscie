// SOlved by @kitanoyoru
// https://leetcode.com/problems/check-if-the-sentence-is-pangram/

const checkIfPangram = (sentence: string): boolean => {
  const set: boolean[] = new Array(26).fill(false)

  for (let i = 0; i < sentence.length; i++) {
    set[sentence[i].charCodeAt(0) - 97] = true
  }

  for (const val of set) {
    if (!val) {
      return false
    }
  }

  return true
}

console.log(checkIfPangram("thequickbrownfoxjumpsoverthelazydog"))
