// Solved by @kitanoyoru
// https://leetcode.com/problems/time-needed-to-inform-all-employees/

type Queue = Array<{ empl: number; time: number }>

const numOfMinutes = (
  n: number,
  headID: number,
  manager: number[],
  informTime: number[]
): number => {
  let graph: number[][] = []
  let ans: number = 0

  for (let i = 0; i < n; i++) {
    graph.push([])
  }
  for (let i = 0; i < n; i++) {
    if (manager[i] != -1) {
      graph[manager[i]].push(i)
    }
  }

  let q: Queue = []
  q.push({ empl: headID, time: 0 })

  while (q.length) {
    let { empl, time } = q.shift()!
    ans = Math.max(ans, time)

    for (const v of graph[empl]) {
      q.push({ empl: v, time: time + informTime[empl] })
    }
  }

  return ans
}
