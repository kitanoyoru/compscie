// Solved by @kitanoyoru
// https://leetcode.com/problems/letter-combinations-of-a-phone-number/

type Map = {
  readonly [key: string]: string
}

const letterCombinations = (digits: string): string[] => {
  if (!digits.length) {
    return [] as string[]
  }

  const map: Map = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  }

  let ans: string[] = []

  const dfs = (arr: string[], idx: number) => {
    if (idx == digits.length) {
      ans.push(arr.join(""))
      return
    }
    const digit = digits[idx]
    for (let i = 0; i < map[digit].length; i++) {
      arr.push(map[digit][i])
      dfs(arr, idx + 1)
      arr.pop()
    }
  }

  dfs([], 0)

  return ans
}

export {}
