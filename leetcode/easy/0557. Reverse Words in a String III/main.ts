// Solved by @kitanoyoru
// https://leetcode.com/problems/reverse-words-in-a-string-iii/

const reverseWord = (word: string): string => {
  return word.split("").reverse().join("")
}

const reverseWords = (s: string) => {
  return s
    .split(" ")
    .map((word) => reverseWord(word))
    .join(" ")
}

console.log(reverseWords("Let's take LeetCode contest"))
