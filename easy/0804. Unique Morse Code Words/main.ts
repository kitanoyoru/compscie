// Solved by @kitanoyoru
// https://leetcode.com/problems/unique-morse-code-words/

const MORSE_ALPH = [
  ".-",
  "-...",
  "-.-.",
  "-..",
  ".",
  "..-.",
  "--.",
  "....",
  "..",
  ".---",
  "-.-",
  ".-..",
  "--",
  "-.",
  "---",
  ".--.",
  "--.-",
  ".-.",
  "...",
  "-",
  "..-",
  "...-",
  ".--",
  "-..-",
  "-.--",
  "--..",
]

const morse = (word: string) => {
  return word
    .split("")
    .map((char) => MORSE_ALPH[char.charCodeAt(0) - 97])
    .join("")
}

const uniqueMorseRepresentations = (words: string[]): number => {
  let s = new Set()
  for (const word of words) {
    const val = morse(word)
    s.add(val)
  }

  return s.size
}

console.log(uniqueMorseRepresentations(["gin", "zen", "gig", "msg"]))
console.log(uniqueMorseRepresentations(["a"]))
