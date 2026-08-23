// Solved by @kitanoyoru
// https://leetcode.com/problems/average-salary-excluding-the-minimum-and-maximum-salary/

const average = (salary: number[]): number => {
  const min = Math.min(...salary)
  const max = Math.max(...salary)

  return (salary.reduce((a, b) => a + b) - min - max) / (salary.length - 2)
}
