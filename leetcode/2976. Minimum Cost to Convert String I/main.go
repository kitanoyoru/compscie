package main

import "math"

const (
	EngChars = 26
)

func minimumCost(source string, target string, original []byte, changed []byte, cost []int) int64 {
	graph := buildGraph(original, changed, cost)
	optimizePaths(graph)
	return computeTotalCost(source, target, graph)
}

func buildGraph(original, changed []byte, cost []int) [][]int {
	graph := make([][]int, EngChars)
	for i := range graph {
		graph[i] = make([]int, EngChars)
		for j := range graph[i] {
      graph[i][j] = math.MaxInt
		}
	}

  for i, c := range cost {
    from := int(original[i] - 'a')
    to := int(changed[i] - 'a')

    if c < graph[from][to] {
      graph[from][to] = c
    }
  }

  return graph
}

func optimizePaths(graph [][]int) {
  for k := 0; k < EngChars; k++ {
    for i := 0; i < EngChars; i++ {
      if graph[i][k] < math.MaxInt {
        for j := 0; j < EngChars; j++ {
          if graph[k][j] < math.MaxInt {
            if graph[i][k] + graph[k][j] < graph[i][j] {
              graph[i][j] = graph[i][k] + graph[k][j]
            }
          }
        }
      }
    }
  }
}

func computeTotalCost(source, target string, graph [][]int) int64 {
  var total int64

  for i := 0; i < len(source); i++ {
    sourceChar := int(source[i] - 'a')
    targetChar := int(target[i] - 'a')

    if sourceChar != targetChar {
      if graph[sourceChar][targetChar] == math.MaxInt {
        return -1
      }

      total += int64(graph[sourceChar][targetChar])
    }
  }

  return total
}
