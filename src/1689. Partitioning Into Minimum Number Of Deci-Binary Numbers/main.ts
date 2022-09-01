// Solved by @kitanoyoru
// https://leetcode.com/problems/partitioning-into-minimum-number-of-deci-binary-numbers/

const minPartitions = (n: string): number => {
  return Math.max(...n.split("").map((v) => parseInt(v)))
}
