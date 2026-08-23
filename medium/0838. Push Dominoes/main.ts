// Solved by @kitanoyoru
// https://leetcode.com/problems/push-dominoes/

const pushDominoes = (dominoes: string): string => {
  dominoes = "L" + dominoes + "R"

  let n = dominoes.length,
    prev = 0,
    ans: string[] = []

  for (let i = 1; i < n; i++) {
    let diff = i - prev - 1
    if (dominoes[i] == ".") continue
    if (dominoes[i] == dominoes[prev]) {
      for (let j = 0; j < diff; j++) {
        ans.push(dominoes[i])
      }
    } else if (dominoes[i] == "L" && dominoes[prev] == "R") {
      let q = Math.floor(diff / 2)
      let r = diff % 2
      for (let j = 0; j < q; j++) {
        ans.push("R")
      }
      for (let j = 0; j < r; j++) {
        ans.push(".")
      }
      for (let j = 0; j < q; j++) {
        ans.push("L")
      }
    } else {
      for (let j = 0; j < diff; j++) {
        ans.push(".")
      }
    }

    ans.push(dominoes[i])
    prev = i
  }
  ans.pop()
  return ans.join("")
}
